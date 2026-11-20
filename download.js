/* Страница выдачи ключа и файла.
   1) После оплаты Lava возвращает сюда (?session=…, выдан воркером при создании счёта): страница опрашивает сервер и, как только
      оплата подтверждена, крупно показывает ключ. Почта и номер заказа не нужны; сессия запоминается в localStorage, поэтому ключ
      можно открыть снова даже без ссылки.
   2) Запасной ручной ввод: лицензионный ключ или номер заказа Lava.top (?order=…) — для тех, кто уже покупал.
   Ссылка на файл приходит только от сервера и только за действующий ключ/заказ. Адрес сервера лицензий — константа API ниже. */
(function download() {
  const API = 'https://rustomizator-license.rustomizator-auth.workers.dev';
  const form = document.getElementById('dl-form');
  if (!form) return;
  const input = document.getElementById('dl-key');
  const submit = document.getElementById('dl-submit');
  const status = document.getElementById('dl-status');
  const ok = document.getElementById('dl-ok');
  const link = document.getElementById('dl-link');
  const keyBox = document.getElementById('dl-key-box');
  const keyValue = document.getElementById('dl-key-value');
  const keyCopy = document.getElementById('dl-key-copy');

  const $ = (id) => document.getElementById(id);
  const buy = { box: $('dl-buy'), wait: $('dl-wait'), title: $('dl-wait-title'), hint: $('dl-wait-hint'), reveal: $('dl-reveal'), key: $('dl-big-key'), copy: $('dl-big-copy'), link: $('dl-big-link'), tg: $('dl-big-tg'), tgHint: $('dl-big-tg-hint'), manual: $('dl-manual') };
  const SESSION_RE = /^[0-9a-f]{32}$/;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const STORE = 'rz_session';
  const rec = { box: $('dl-recover'), form: $('dl-recover-form'), input: $('dl-recover-input'), submit: $('dl-recover-submit'), status: $('dl-recover-status') };
  const readStored = () => { try { return localStorage.getItem(STORE) || ''; } catch { return ''; } };
  const PENDING = 'rz_pending'; // ставится при создании счёта, снимается, когда ключ показан: по нему страницы сайта зовут за ключом
  const isPending = () => { try { return localStorage.getItem(PENDING) === '1'; } catch { return false; } };
  const clearPending = () => { try { localStorage.removeItem(PENDING); } catch { /* ok */ } };

  // Ключ проявляется по символам (дефисы — акцентным цветом); текст сохраняется целиком для копирования и скринридеров.
  let buyShown = false;
  function showKey(key, url, session) {
    buyShown = true;
    // Ссылка в бота с токеном заказа: по ней бот привязывает чат и присылает ключ, файл и инструкцию.
    const hasSession = SESSION_RE.test(session || '');
    if (buy.tg) {
      buy.tg.hidden = !hasSession;
      if (hasSession) buy.tg.href = 'https://t.me/Rustomizator_bot?start=o_' + session;
    }
    if (buy.tgHint) buy.tgHint.hidden = !hasSession;
    buy.key.textContent = '';
    buy.key.setAttribute('aria-label', 'Лицензионный ключ: ' + key);
    Array.from(key).forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch' + (ch === '-' ? ' sep' : '');
      s.style.setProperty('--i', i);
      s.textContent = ch;
      s.setAttribute('aria-hidden', 'true');
      buy.key.append(s);
    });
    clearPending();
    buy.wait.hidden = true;
    buy.reveal.hidden = false;
    buy.box.hidden = false;
    buy.manual.hidden = true;
    if (typeof url === 'string' && /^https:\/\//.test(url)) buy.link.href = url;
    buy.copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(key);
        buy.copy.textContent = 'Скопировано';
        setTimeout(() => { buy.copy.textContent = 'Скопировать ключ'; }, 2000);
      } catch {
        const r = document.createRange();
        r.selectNodeContents(buy.key);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        buy.copy.textContent = 'Выделено — нажмите Ctrl+C';
      }
    };
  }

  const WAIT = {
    pending: ['Ждём подтверждение оплаты…', 'Обычно это занимает несколько секунд. Не закрывайте страницу.', ''],
    failed: ['Платёж пока не подтверждён', 'Если вы оплатили, подождите минуту: страница обновится сама. Если платёж не прошёл — вернитесь к тарифам и повторите.', 'warn'],
    slow: ['Подтверждение занимает дольше обычного', 'Страница продолжает проверять. Её адрес сохранён — можно закрыть и вернуться позже. Если ключа нет больше часа, напишите в поддержку.', 'warn'],
    offline: ['Нет связи с сервером', 'Проверяем снова. Ваш заказ сохранён — ничего повторно оплачивать не нужно.', 'error'],
  };
  function waiting(kind) {
    const [title, hint, tone] = WAIT[kind] || WAIT.pending;
    buy.title.textContent = title;
    buy.hint.textContent = hint;
    buy.wait.dataset.kind = tone;
    buy.wait.hidden = false;
    buy.reveal.hidden = true;
    buy.box.hidden = false;
  }

  // ref — { session } (токен страницы) или { invoice_id } (номер счёта Lava): сервер находит заказ по любому из них.
  async function fetchStatus(ref) {
    const res = await fetch(API + '/api/order-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ref), cache: 'no-store' });
    return res.json();
  }

  // Поиск по почте покупки (прямая покупка в Lava, вернулись не на сайт): сервер сверяет оплаченные счета этой почты.
  async function recoverByMail(email) {
    const res = await fetch(API + '/api/recover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }), cache: 'no-store' });
    return res.json();
  }

  // Опрос: первые 60 с — каждые 2 с, дальше реже; после 3 минут показываем «дольше обычного», но не прекращаем.
  async function followSession(ref, { patient }) {
    const started = Date.now();
    waiting('pending');
    for (;;) {
      let data = null;
      try { data = await fetchStatus(ref); } catch { data = null; }
      if (data && data.status === 'paid' && typeof data.key === 'string' && data.key) {
        // Токен страницы запоминаем (если сервер его вернул): ключ откроется снова даже без ссылки.
        try { localStorage.setItem(STORE, SESSION_RE.test(data.session || '') ? data.session : (ref.session || '')); } catch { /* ok */ }
        if (rec.box) rec.box.hidden = true;
        showKey(data.key, data.download_url, SESSION_RE.test(data.session || '') ? data.session : ref.session);
        return true;
      }
      if (!patient) return false; // ссылка не из письма/возврата: один взгляд, без ожидания
      if (!data) waiting('offline');
      else if (data.status === 'not_found') { buy.box.hidden = true; return false; }
      else if (data.status === 'failed') waiting('failed');
      else waiting(Date.now() - started > 180000 ? 'slow' : 'pending');
      const age = Date.now() - started;
      await new Promise((r) => setTimeout(r, age < 60000 ? 2000 : age < 300000 ? 4000 : 10000));
    }
  }

  // Формат ключа — RUST-XXXX-XXXX-XXXX (см. генератор ключей на сервере). Всё остальное считаем номером заказа.
  const KEY_RE = /^RUST-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;

  const NOT_FOUND = 'Ключ не найден. Проверьте правильность ввода из чека Lava.top';
  const MESSAGES = {
    expired: 'Срок действия ключа истёк. Напишите в поддержку — контакт указан в сообщении после оплаты.',
    rate_limited: 'Слишком много попыток. Подождите несколько минут и повторите.',
    unavailable: 'Выдача файла временно недоступна. Напишите в поддержку — контакт указан в сообщении после оплаты.',
    order_not_found: 'Заказ не найден. Если вы только что оплатили — подождите минуту (сервер ещё обрабатывает платёж) и повторите.',
  };

  const show = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind || '';
    status.hidden = !text;
  };
  const busy = (on) => {
    submit.disabled = on;
    submit.textContent = on ? 'Проверяем…' : 'Проверить и скачать';
    input.readOnly = on;
  };
  const reset = () => {
    ok.hidden = true;
    link.removeAttribute('href');
    keyBox.hidden = true;
    keyValue.textContent = '';
    keyCopy.textContent = 'Скопировать ключ';
  };

  async function checkAndDownload(raw) {
    reset();
    // Пробелы и переносы строк из письма вырезаем: ни ключ, ни номер заказа их не содержат.
    const value = raw.replace(/\s+/g, '');
    if (!value) { show('Введите номер заказа или лицензионный ключ.', 'error'); input.focus(); return; }
    show('Проверяем…', 'info');
    busy(true);
    try {
      const payload = KEY_RE.test(value) ? { key: value.toUpperCase() } : { order_id: value };
      const res = await fetch(API + '/api/download-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      const data = await res.json().catch(() => null);
      const url = data && data.valid === true ? data.download_url : '';
      if (typeof url === 'string' && /^https:\/\//.test(url)) {
        show('', '');
        // Ответ по номеру заказа содержит сам ключ (покупатель его ещё не видел) — показываем и даём скопировать.
        if (typeof data.key === 'string' && data.key) {
          keyValue.textContent = data.key;
          keyBox.hidden = false;
        }
        link.href = url;
        ok.hidden = false;
        link.click();
      } else if (data && MESSAGES[data.code]) {
        show(MESSAGES[data.code], 'error');
      } else if (data && data.valid === false && (data.code === 'invalid_key' || data.code === 'order_not_found')) {
        show(data.code === 'order_not_found' ? MESSAGES.order_not_found : NOT_FOUND, 'error');
      } else {
        // Любой другой ответ (сервер не обновлён, сбой) — не «не найдено»: покупатель с верным ключом не должен так решить.
        show('Не удалось проверить: сервер проверки сейчас недоступен. Повторите через несколько минут.', 'error');
      }
    } catch {
      show('Не удалось связаться с сервером. Проверьте соединение и повторите.', 'error');
    } finally {
      busy(false);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkAndDownload(input.value);
  });

  keyCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(keyValue.textContent);
      keyCopy.textContent = 'Скопировано';
      setTimeout(() => { keyCopy.textContent = 'Скопировать ключ'; }, 2000);
    } catch {
      keyCopy.textContent = 'Выделите ключ вручную';
    }
  });

  // Правка поля после ответа сбрасывает прежний результат — ссылка и ключ не должны висеть под другим вводом.
  input.addEventListener('input', () => { reset(); if (status.dataset.kind === 'error') show('', ''); });

  // Что Lava допишет при возврате, заранее неизвестно (`?session=…`, `&invoiceId=…&status=…`, склеенные через второй `?`), поэтому
  // разбираем адрес «как есть»: токен страницы и номер счёта ищутся и по именам параметров, и по виду значения в любом месте.
  const params = new URLSearchParams(location.search);
  const raw = decodeURIComponent(location.search + location.hash);
  const pick = (names) => names.map((n) => params.get(n)).find(Boolean) || '';
  const find = (text, re) => (text.match(re) || [])[0] || '';
  const SESSION_ANY = /(?<![0-9a-f])[0-9a-f]{32}(?![0-9a-f])/i;
  const UUID_ANY = /[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/i;
  const sessionFromUrl = find(pick(['session']), SESSION_ANY) || find(raw, SESSION_ANY);
  const invoiceFromUrl = find(pick(['invoiceId', 'invoice_id', 'order_id', 'order', 'contractId']), UUID_ANY) || find(raw, UUID_ANY);

  if (SESSION_RE.test(sessionFromUrl.toLowerCase()) || UUID_RE.test(invoiceFromUrl)) {
    // Возврат после оплаты: ручной ввод прячем — ключ придёт сам; не получилось — показываем ручной ввод и восстановление.
    const ref = SESSION_RE.test(sessionFromUrl.toLowerCase()) ? { session: sessionFromUrl.toLowerCase() } : { invoice_id: invoiceFromUrl.toLowerCase() };
    buy.manual.hidden = true;
    followSession(ref, { patient: true }).then((ok) => { if (!ok) buy.manual.hidden = false; });
  } else {
    // Без ссылки: ключ ищется по токену браузера (его создаёт сайт до оплаты) и показывается сам; иначе — запомненная покупка или форма.
    const stored = readStored();
    if (typeof window.rzCheckSession === 'function') {
      window.rzCheckSession().then((d) => {
        if (d && d.success && typeof d.key === 'string' && !buyShown) {
          if (rec.box) rec.box.hidden = true;
          showKey(d.key, d.download_url, d.session);
        }
      });
    }
    // Покупка начата в этом браузере и ключ ещё не показан — ждём терпеливо (оплата могла пройти в приложении банка), иначе один взгляд.
    if (SESSION_RE.test(stored)) {
      const patient = isPending();
      if (patient) buy.manual.hidden = true;
      followSession({ session: stored }, { patient }).then((ok) => { if (!ok) buy.manual.hidden = false; });
    }
    // Старая ссылка вида download.html?order=… — номер заказа подставляется и проверка запускается сама.
    const order = params.get('order');
    if (order) {
      input.value = order.trim();
      checkAndDownload(input.value);
    }
  }

  // Ручное восстановление: «Не отобразился ключ?» — номер счёта из чека Lava (UUID).
  if (rec.form) {
    const say = (text, kind) => { rec.status.textContent = text; rec.status.dataset.kind = kind || ''; rec.status.hidden = !text; };
    rec.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = rec.input.value.replace(/\s+/g, '').toLowerCase();
      const byMail = value.includes('@');
      if (!byMail && !UUID_RE.test(value)) { say('Введите почту, с которой платили, или номер счёта из чека Lava (вида 9ce5bb91-7ece-498a-9b18-8fa8c245fb4f).', 'error'); rec.input.focus(); return; }
      say('Ищем заказ…', 'info');
      rec.submit.disabled = true;
      try {
        const data = byMail ? await recoverByMail(value) : await fetchStatus({ invoice_id: value });
        if (data && data.status === 'paid' && data.key) {
          try { localStorage.setItem(STORE, SESSION_RE.test(data.session || '') ? data.session : ''); } catch { /* ok */ }
          say('', '');
          rec.box.hidden = true;
          showKey(data.key, data.download_url, data.session);
        } else if (data && (data.status === 'pending' || data.status === 'failed')) {
          say('Заказ найден, но оплата ещё не подтверждена. Подождите минуту и нажмите «Найти ключ» снова.', 'error');
        } else if (data && data.status === 'bad_email') {
          say('Это не похоже на почту. Проверьте адрес.', 'error');
        } else if (data && data.status === 'rate_limited') {
          say('Слишком много попыток. Подождите несколько минут.', 'error');
        } else if (data && data.status === 'not_found') {
          say(byMail ? 'Оплаченных покупок на эту почту не найдено. Проверьте адрес или введите номер счёта из чека Lava, либо напишите в поддержку.' : 'Счёт не найден. Проверьте номер из чека Lava или напишите в поддержку.', 'error');
        } else {
          say('Сервер не ответил. Повторите через минуту.', 'error');
        }
      } catch {
        say('Не удалось связаться с сервером. Проверьте соединение и повторите.', 'error');
      } finally {
        rec.submit.disabled = false;
      }
    });
  }
})();
