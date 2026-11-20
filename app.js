/* Rustomizator v5 — лендинг. Без сборки и внешних зависимостей.
   Всё, что меняет продавец, — в CONFIG. Ниже — независимые модули: каждый проверяет, есть ли его разметка на странице,
   поэтому один и тот же файл подключён и к главной, и к юридическим страницам. */

/* =====================================================================
   CONFIG — заполнить перед публикацией
   ===================================================================== */
const CONFIG = {
  version: '5.3.0',
  // Дата выхода текущей версии, например '12 октября 2026'. Обновляет конвейер релиза (RELEASE_GUIDE.md в репозитории
  // программы). Пусто — строка «Последнее обновление» не показывается.
  updated: '20 ноября 2026',

  // Канал до покупки. Контакт поддержки покупателей здесь не публикуем — он приходит после оплаты.
  support: {
    telegram: 'https://t.me/rustomizator',
    label: 'Telegram-канал (Обсудить)',
  },

  // Продавец — только в реквизитах юридических страниц (legal/*.html, закрыты от индексации). На главной — лишь ссылки на документы.

  // Тарифы. Сроки совпадают с теми, что умеет выдавать сервер лицензий (дни). «Навсегда» снят с продажи 21.11.2026.
  // contact: true — у тарифа ещё нет товара в Lava: кнопка ведёт в Telegram поддержки (CONFIG.contactUrl).
  // price — рубли числом. Скидок нет: зачёркнутых цен на сайте не показываем.
  // tariff — идентификатор тарифа для воркера (`worker/worker.js::TARIFFS`): кнопка «Купить» создаёт счёт Lava через воркер, и после
  // оплаты покупатель возвращается на download.html, где ключ появляется сам. url — страница товара lava.top (запасная, не используется).
  // badge — бейдж над названием; hot — главный тариф: широкая карточка над остальными, доводы (why) и таблица отличий.
  // short — подпись столбца в таблице отличий (на телефоне длинные названия не влезают).
  contactUrl: 'https://t.me/yuzuken333',
  plans: [
    {
      name: '7 дней',
      short: '7 дней',
      price: 299,
      desc: 'Проверить программу на своём ПК.',
      features: ['Все функции программы, 124 твика', 'Ключ на 1 ПК', 'Срок — с момента активации'],
      tariff: '7',
    },
    {
      name: '30 дней',
      short: '30 дней',
      price: 549,
      desc: 'Для регулярной игры.',
      features: ['Все функции программы, 124 твика', 'Ключ на 1 ПК', 'Срок — с момента активации', 'Поддержка в Telegram'],
      tariff: '30',
    },
    {
      name: '90 дней',
      short: '90 дней',
      price: 999,
      badge: 'Выгодно',
      desc: 'Три месяца по цене меньше двух.',
      features: ['Все функции программы, 124 твика', 'Ключ на 1 ПК', '≈ 333 ₽ в месяц вместо 549 ₽', 'Поддержка в Telegram'],
      tariff: '90',
    },
    {
      name: 'Личная настройка ноутбука',
      short: 'Ноутбук',
      price: 1099,
      desc: 'Онлайн-сеанс в Discord для ноутбука + 90 дней программы.',
      features: ['90 дней программы', 'Андервольт процессора и видеокарты, где это открыто', 'Фирменная утилита производителя, режимы питания', 'Переключение на дискретную видеокарту (MUX), где есть', 'Windows, драйверы и Rust'],
      tariff: 'laptop',
    },
    {
      name: 'Личная настройка ПК',
      short: 'ПК',
      price: 1199,
      badge: 'Хит продаж',
      hot: true,
      desc: 'Программа на 90 дней и личный онлайн-сеанс в Discord: вы показываете экран, мы вместе доводим ваш ПК до максимума под Rust — включая BIOS.',
      why: [
        ['Больше, чем умеет программа.', 'В сеансе настраивается то, до чего программа сама не дотягивается, — BIOS, драйверы, Windows — с вашего согласия и по заранее согласованному списку.'],
        ['Настройка под ваше железо, а не «среднее».', 'Что включать, а что нет, решаем, глядя на ваш ПК и ваши замеры.'],
        ['Вопросы — сразу, вживую.', 'Не надо разбираться в 124 твиках самому: спрашиваете в сеансе и видите результат.'],
      ],
      tariff: 'pc_plus',
    },
    {
      name: 'Ultimate — ПК с нуля',
      short: 'Ultimate',
      price: 2499,
      later: 2999,
      launchLeft: 10,
      ultimate: true,
      desc: 'Полная оптимизация ПК с чистого листа: BIOS, система, драйверы, игра и замеры «до / после». Сеанс 3–5 часов в Discord.',
      groups: [
        ['Железо', ['BIOS с нуля: Re-Size BAR, C-states, режимы', 'Разгон и тайминги памяти с проверкой стабильности', 'Процессор: PBO / Curve Optimizer или андервольт', 'Видеокарта: кривая и тест стабильности']],
        ['Система', ['Чистая установка Windows и облегчение системы', 'Драйверы с нуля: чипсет, видео, сеть, звук', 'Образ идеальной системы — откат за 10 минут']],
        ['Игра и результат', ['Монитор, мышь, Rust: графика, бинды, ядра', 'Бенчмарк и замер FPS «до / после»', 'Повторная проверка через 2–4 недели', '6 месяцев программы + приоритетная поддержка']],
      ],
      tariff: 'ultimate',
    },
  ],

  // Таблица отличий тарифов: значения по порядку CONFIG.plans. true — есть, false — нет, строка — как есть.
  compare: [
    ['Срок программы', ['7 дней', '30 дней', '90 дней', '90 дней', '90 дней', '6 мес.']],
    ['Поддержка в Telegram', [false, true, true, true, true, true]],
    ['Личный сеанс в Discord', [false, false, false, true, true, true]],
    ['Настройка BIOS', [false, false, false, false, true, true]],
    ['Разгон памяти и чистая Windows', [false, false, false, false, false, true]],
    ['Замер «до / после» и повторная проверка', [false, false, false, false, false, true]],
  ],

  // Цитата из настоящего отзыва (CONFIG.reviews) в карточке главного тарифа — с подписью, что это замер покупателя.
  starQuote: { nick: 'killed', text: 'ФПС прибавилось с 40 до 90…' },

  // Отзывы покупателей (лента по центру страницы). Тексты — как у авторов; в «DRAGO» нецензурное слово скрыто звёздочками,
  // в отзыве «пак за 900» убрано сравнение с другим продавцом. Видео: poster и src лежат в assets/reviews/.
  // Выдуманных отзывов здесь быть не должно — только настоящие.
  reviews: [
    { nick: 'евросоюз', text: 'До нормальной оптимизации было в среднем 70 фпс с просадками и фризами (на зеоне). После оптимизации и переустановки винды и включения настройки в биосе — не помню какую точно — стало стабильных 110 фпс, с просадками до 90. Оптимизация отличная, и очень добрая и отзывчивая. Советую к покупке.' },
    { nick: 'Chamor', text: 'Покупал ещё давно, как проект открылся, фул оптимку: прибавило плавности и ±10 стабильных ФПС. Сейчас как опять начал играть в Раст — купил на 30 дней проги. Стала удобней. До новой проги было 30–20 ФПС в джунглях, щас 40–50 и больше. Также хочу поиграться с разгоном ПК, как-то страшно, а так всем советую.' },
    { nick: 'Lnaxi', text: 'Ну купил прогу, сомневался сначала, думал, что хрень какая-то, а оказалось бомба просто: ФПС увеличился, фризы пропали, так ещё и растяг имеется. Топ за свои деньги.' },
    { nick: 'Видеоотзыв', video: { src: 'assets/reviews/before-after.mp4', poster: 'assets/reviews/before-after.webp' }, text: 'Покупатель показал замер на своём ПК: было 81–87 FPS, стало 138–145 FPS, без просадок. Тариф «Навсегда + личная настройка».' },
    { nick: 'Sedo Fizz', text: 'Купил буст, думал, не сильно много ФПС даст. Бегал всё время с 40–50 ФПС с постоянными фризами. После оптимизации и настройки BIOS ФПС поднялся в 2 раза, сейчас бегаю в стабильные 70 без микрофризов и постоянных зависаний. Оптимизация полностью оправдывает свою стоимость. Очень вежливый и общительный админ.' },
    { nick: 'killed', text: 'Всё очень понравилось: админ, кроме того что сделал оптимизацию, ещё и помог мне во всём разобраться. ФПС прибавилось с 40 до 90, именно из-за доптимизации в биосе (помимо проги). Цена за услуги оправдана, я очень приятно удивлён.' },
    { nick: 'DRAGO', text: '+реп, подняло 30 фпс, плавность дало и а*у**ный владелец.' },
    { nick: '专用集成电路', text: 'Оптимизация топ, стало очень плавно, есть насыщенность и личная настройка, и это навсегда. Берите пак за 900 рублей, не пожалеете, ещё и биос настроят. Советую.' },
    { nick: 'Видеоотзыв', video: { src: 'assets/reviews/gameplay.mp4', poster: 'assets/reviews/gameplay.webp' }, text: 'Запись игры с оверлеем FPS от покупателя.' },
  ],

  // Замер фреймтайма. null — блок с графиком не показывается.
  // Публиковать только настоящий замер (например PresentMon, одинаковый маршрут до и после):
  // {
  //   rig: 'Ryzen 5 5600 · RTX 3060 · 16 ГБ · Windows 11 23H2',
  //   method: 'PresentMon, 60 с, сервер …, один маршрут',
  //   before: [/* мс на кадр */], after: [/* мс на кадр */],
  //   stats: [{ label: 'Средний фреймтайм', before: '…', after: '…' }],
  // }
  measurements: null,
};

/* =====================================================================
   Общие утилиты
   ===================================================================== */
const html = document.documentElement;

/* Телефоны и планшеты: касание или экран до 1024 px. Здесь фон статичный (canvas не рисуется, цикл кадров стоит),
   а размытие под карточками снимает CSS в том же медиазапросе. ПК (мышь, шире 1024 px) работает как прежде.
   Адресная диагностика: ?fx=noblur,nocanvas,noanim — каждый флаг отключает один эффект, чтобы найти самый тяжёлый на устройстве. */
const lowFx = window.matchMedia('(pointer: coarse), (max-width: 1024px)');

(function fxProfile() {
  const flags = (new URLSearchParams(location.search).get('fx') || '').split(',');
  flags.map((f) => f.trim()).filter((f) => ['noblur', 'nocanvas', 'noanim'].includes(f)).forEach((f) => html.classList.add('fx-' + f));
})();
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// Доля пути до цели за dt секунд при «скорости» rate — плавность не зависит от частоты кадров.
const damp = (dt, rate) => 1 - Math.exp(-rate * dt);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Колбэки «интро началось» (класс is-ready на <html>).
const readyCallbacks = [];
const onReady = (cb) => { if (html.classList.contains('is-ready')) cb(); else readyCallbacks.push(cb); };

/* =====================================================================
   Модуль: значения из CONFIG (версия, контакты, продавец, год)
   ===================================================================== */
(function applyConfig() {
  $$('[data-version]').forEach((n) => { n.textContent = 'v' + CONFIG.version; });
  $$('[data-updated]').forEach((n) => {
    if (!CONFIG.updated) return;
    n.textContent = 'Последнее обновление: ' + CONFIG.updated;
    n.hidden = false;
  });
  $$('[data-year]').forEach((n) => { n.textContent = String(new Date().getFullYear()); });

  $$('[data-support="telegram"]').forEach((a) => {
    a.href = CONFIG.support.telegram;
    a.target = '_blank';
    a.rel = 'noopener';
    if (!a.textContent.trim()) a.textContent = CONFIG.support.label;
  });
})();

// Окно оформления заказа; настоящую функцию ставит модуль payModal ниже.
let openPay = () => {};
// Сервер лицензий (Cloudflare Worker): оформление счёта Lava и выдача ключа после оплаты.
const LICENSE_API = 'https://rustomizator-license.rustomizator-auth.workers.dev';
const CHECKOUT_TIMEOUT_MS = 30000; // счёт обычно создаётся до 5 с, иногда до 30; дольше — окно ошибки с оплатой напрямую в Lava
// Поддержка и вопросы до покупки — бот с deep-link: ссылки с data-support-link / data-presale-link получают адрес отсюда.
const SUPPORT_URL = 'https://t.me/Rustomizator_bot?start=support';
const PRESALE_URL = 'https://t.me/Rustomizator_bot?start=presale';
document.querySelectorAll('[data-support-link]').forEach((a) => { a.href = SUPPORT_URL; });
document.querySelectorAll('[data-presale-link]').forEach((a) => { a.href = PRESALE_URL; });

/* Токен браузера покупателя (UUIDv4): создаётся при первом визите и уходит на сервер вместе со счётом. По нему любая страница
   сайта находит оплаченный заказ и показывает ключ, даже если Lava не вернула покупателя сюда. */
const CLIENT_TOKEN_KEY = 'rustomizator_client_token';
const UUID4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function clientToken() {
  try {
    const saved = localStorage.getItem(CLIENT_TOKEN_KEY);
    if (saved && UUID4.test(saved)) return saved;
    const fresh = makeUuid4();
    localStorage.setItem(CLIENT_TOKEN_KEY, fresh);
    return fresh;
  } catch {
    return makeUuid4(); // хранилище закрыто: токен живёт до перезагрузки, сервер всё равно найдёт заказ по сессии и номеру счёта
  }
}
function makeUuid4() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
/* Прогрев соединения с сервером оплаты. Из РФ рукопожатие TLS с Cloudflare идёт ~4 с; если открыть его заранее (пока человек
   смотрит тарифы и вводит почту), «Купить» создаёт счёт без этой паузы. Лёгкий GET, не чаще раза в 20 с, ничего не меняет. */
let warmAt = 0;
function warmCheckout() {
  if (Date.now() - warmAt < 20000) return;
  warmAt = Date.now();
  fetch(LICENSE_API + '/api/check-session?token=' + encodeURIComponent(clientToken()), { cache: 'no-store' }).catch(() => {});
}
/** Ответ /api/check-session: { success, key, plan, invoice_id, download_url } или { success:false, pending }. null — нет связи. */
async function checkSession() {
  try {
    const res = await fetch(LICENSE_API + '/api/check-session?token=' + encodeURIComponent(clientToken()), { cache: 'no-store' });
    return await res.json();
  } catch {
    return null;
  }
}
window.rzCheckSession = checkSession;
/** Кнопка «Получить в Telegram»: бот по токену заказа пришлёт ключ, актуальный файл и инструкцию (и сам /start нажимать не нужно). */
const BOT_NAME = 'Rustomizator_bot';
function telegramLink(session, extraClass) {
  const a = document.createElement('a');
  a.className = 'btn btn-primary ' + (extraClass || '');
  a.href = 'https://t.me/' + BOT_NAME + '?start=o_' + session;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = 'Получить ключ и файл в Telegram';
  return a;
}
window.rzTelegramLink = telegramLink;
const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';

/* =====================================================================
   Модуль: тарифы
   ===================================================================== */
(function renderPlans() {
  const root = $('#plans');
  if (!root) return;
  const buy = (plan, cls, label) => {
    if (plan.contact) {
      const a = el('a', cls, label);
      a.href = CONFIG.contactUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      return a;
    }
    const btn = el('button', cls, label);
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', () => openPay(plan, btn));
    ['pointerenter', 'touchstart', 'focus'].forEach((ev) => btn.addEventListener(ev, warmCheckout, { passive: true }));
    return btn;
  };

  // Главный тариф — широкая карточка над остальными: цена, доводы, разница с «Навсегда», цитата покупателя, таблица отличий.
  const star = CONFIG.plans.find((p) => p.hot);
  const offer = $('#star-offer');
  if (star && offer) {
    const top = el('div', 'plan-top');
    if (star.badge) top.append(el('span', 'plan-badge is-hot', star.badge));
    offer.append(top);
    offer.append(el('h3', 'star-name', star.name));
    const row = el('div', 'star-price-row');
    row.append(el('b', 'star-price', rub(star.price)));
    row.append(el('span', 'star-delta', 'Лучший баланс цены и результата'));
    offer.append(row);
    if (star.desc) offer.append(el('p', 'star-desc', star.desc));
    const why = el('ol', 'star-why');
    (star.why || []).forEach(([head, text]) => {
      const li = el('li');
      li.append(el('b', null, head), document.createTextNode(' ' + text));
      why.append(li);
    });
    offer.append(why);
    offer.append(buy(star, 'btn btn-primary btn-lg star-buy', 'Купить с личной настройкой'));
    if (CONFIG.starQuote) {
      const q = el('figure', 'star-quote');
      q.append(el('blockquote', null, '«' + CONFIG.starQuote.text + '»'));
      q.append(el('figcaption', null, CONFIG.starQuote.nick + ', покупатель. Это его замер на его ПК — у вашего прирост будет свой.'));
      offer.append(q);
    }
  } else if ($('#plan-star')) {
    $('#plan-star').remove();
  }

  const table = $('#cmp-table');
  if (table && CONFIG.compare) {
    const head = el('tr');
    head.append(el('th', null, ''));
    CONFIG.plans.forEach((p) => {
      const th = el('th', p.hot ? 'is-star' : null, p.short || p.name);
      th.scope = 'col';
      head.append(th);
    });
    const thead = el('thead');
    thead.append(head);
    const tbody = el('tbody');
    const cell = (v, hot) => {
      const td = el('td', hot ? 'is-star' : null);
      if (v === true) { td.append(el('span', 'cmp-yes')); td.setAttribute('aria-label', 'есть'); }
      else if (v === false) { td.append(el('span', 'cmp-no')); td.setAttribute('aria-label', 'нет'); }
      else td.textContent = v;
      return td;
    };
    CONFIG.compare.forEach(([label, values]) => {
      const tr = el('tr');
      const th = el('th', null, label);
      th.scope = 'row';
      tr.append(th);
      values.forEach((v, i) => tr.append(cell(v, CONFIG.plans[i] && CONFIG.plans[i].hot)));
      tbody.append(tr);
    });
    const price = el('tr', 'cmp-price');
    const pth = el('th', null, 'Цена');
    pth.scope = 'row';
    price.append(pth);
    CONFIG.plans.forEach((p) => price.append(cell(rub(p.price), p.hot)));
    tbody.append(price);
    table.append(thead, tbody);
  }

  // Остальные тарифы — спокойные карточки под главным.
  CONFIG.plans.filter((p) => !p.hot && !p.ultimate).forEach((plan) => {
    const card = el('article', 'plan glass reveal');
    if (plan.badge) {
      const top = el('div', 'plan-top');
      top.append(el('span', 'plan-badge is-deal', plan.badge));
      card.append(top);
    }
    card.append(el('h3', null, plan.name));
    const row = el('div', 'plan-price-row');
    row.append(el('b', 'plan-price', rub(plan.price)));
    card.append(row);
    if (plan.desc) card.append(el('p', 'plan-desc', plan.desc));
    const list = el('ul');
    plan.features.forEach((f) => list.append(el('li', null, f)));
    card.append(list);
    card.append(buy(plan, 'btn btn-block btn-ghost', plan.contact ? 'Оформить в Telegram' : 'Купить'));
    root.append(card);
  });

  // Ultimate — первым блоком раздела «Тарифы», над главным тарифом: широкая «золотая» витрина с бегущей рамкой.
  const ult = CONFIG.plans.find((p) => p.ultimate);
  if (ult) {
    const card = el('article', 'ult reveal');
    card.id = 'plan-ultimate';
    card.append(el('span', 'ult-border'), el('span', 'ult-glow'), el('span', 'ult-glow ult-glow-2'));
    const inner = el('div', 'ult-inner');
    const head = el('div', 'ult-head');

    const left = el('div', 'ult-title');
    const top = el('div', 'plan-top');
    top.append(el('span', 'plan-badge ult-badge', '★ Новинка · максимум'));
    left.append(top);
    const h = el('h3');
    h.append(el('span', 'ult-kicker', 'Ultimate'), el('span', 'ult-sub', 'Полная оптимизация ПК с нуля'));
    left.append(h);
    if (ult.desc) left.append(el('p', 'ult-desc', ult.desc));
    const chips = el('ul', 'ult-chips');
    ['BIOS и разгон памяти', 'Чистая Windows', 'Замер «до / после»', '6 месяцев программы'].forEach((t) => chips.append(el('li', null, t)));
    left.append(chips);

    const pr = el('div', 'ult-price');
    if (ult.launchLeft) {
      const seats = el('div', 'ult-seats');
      seats.append(el('b', null, String(ult.launchLeft)), el('span', null, 'мест из 10 по стартовой цене'));
      const bar = el('div', 'ult-bar');
      const fill = el('i');
      fill.style.width = (ult.launchLeft / 10) * 100 + '%';
      bar.append(fill);
      seats.append(bar);
      pr.append(seats);
    }
    const row = el('div', 'plan-price-row');
    row.append(el('b', 'plan-price', rub(ult.price)));
    if (ult.later) row.append(el('s', 'plan-old', rub(ult.later)));
    pr.append(row);
    if (ult.later) pr.append(el('p', 'ult-note', 'Для первых ' + ult.launchLeft + ' покупателей. Дальше — ' + rub(ult.later) + '.'));
    pr.append(buy(ult, 'btn btn-lg ult-buy', ult.contact ? 'Записаться в Telegram' : 'Забрать по стартовой цене'));
    head.append(left, pr);
    inner.append(head);

    const groups = el('div', 'ult-groups');
    (ult.groups || []).forEach(([title, items]) => {
      const g = el('div', 'ult-group');
      g.append(el('h4', null, title));
      const ul = el('ul');
      items.forEach((t) => ul.append(el('li', null, t)));
      g.append(ul);
      groups.append(g);
    });
    inner.append(groups);
    card.append(inner);
    const anchor = $('#plan-star') || root;
    anchor.before(card);

    // Подсказка в шапке раздела и в меню: ведёт прямо к Ultimate.
    const headEl = document.querySelector('#pricing .section-head');
    if (headEl) {
      const a = el('a', 'ult-teaser', 'Новый тариф Ultimate — ПК с нуля, от ' + rub(ult.price) + ' →');
      a.href = '#plan-ultimate';
      headEl.append(a);
    }
    const navLink = document.querySelector('a[href="#pricing"]');
    if (navLink) navLink.append(el('span', 'nav-new', 'NEW'));
  }
})();

/* =====================================================================
   Модуль: окно оформления заказа — выбор платёжного шлюза перед переходом на lava.top.
   У тарифа один товар на lava.top: там покупатель и выбирает валюту/метод на странице оформления, а карточки здесь —
   витрина поддерживаемых способов. Клик по любой открывает ссылку тарифа в новой вкладке и закрывает окно.
   Закрытие — крестик, Esc, клик мимо окна; фокус возвращается на кнопку «Купить».
   ===================================================================== */
(function payModal() {
  const dlg = $('#pay');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const title = $('#pay-title', dlg);
  const status = $('#pay-status', dlg);
  let opener = null;
  let closing = 0;
  let selectedTariff = '';
  let selectedPlanUrl = '';
  let working = false;

  const say = (text, kind) => {
    if (!status) return;
    status.textContent = text;
    status.dataset.kind = kind || '';
    status.hidden = !text;
  };

  openPay = (plan, from) => {
    warmCheckout();
    opener = from;
    selectedTariff = plan.tariff || '';
    selectedPlanUrl = /^https:\/\/app\.lava\.top\//.test(plan.url || '') ? plan.url : '';
    working = false;
    dlg.classList.remove('is-busy');
    say('', '');
    clearTimeout(closing);
    closing = 0;
    title.textContent = plan.name + ' — ' + rub(plan.price);
    dlg.classList.remove('is-closing');
    dlg.showModal();
    html.classList.add('is-modal');
  };
  const close = () => {
    if (!dlg.open || closing) return;
    dlg.classList.add('is-closing');
    closing = setTimeout(() => {
      closing = 0;
      dlg.classList.remove('is-closing');
      dlg.close();
      html.classList.remove('is-modal');
      if (opener) opener.focus();
    }, 280);
  };
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  $('.pay-x', dlg).addEventListener('click', close);

  // Способ оплаты: валюта счёта и, для СБП и PayPal, провайдер Lava (его выбирает воркер по `method`).
  const CURRENCY = { sbp: 'RUB', 'card-ru': 'RUB', 'card-by': 'RUB', 'card-ua': 'USD', paypal: 'USD', europe: 'EUR', 'applepay-usd': 'USD', 'applepay-eur': 'EUR' };
  // @юзернейм Telegram (необязательно): по нему бот присылает ключ и файл тому, кто уже запускал бота. Запоминаем для следующих покупок.
  const tgInput = $('#pay-tg', dlg);
  // Почта обязательна: её вводит сам покупатель (требование Lava), в счёт уходит без подстановок. Запоминаем для следующих покупок.
  const emailInput = $('#pay-email', dlg);
  const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
  try { if (emailInput && !emailInput.value) emailInput.value = localStorage.getItem('rz_email') || ''; } catch { /* хранилище недоступно */ }
  if (emailInput) emailInput.addEventListener('input', () => { emailInput.removeAttribute('aria-invalid'); });
  if (emailInput) emailInput.addEventListener('focus', warmCheckout);
  const TG_RE = /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/;
  try { if (tgInput && !tgInput.value) tgInput.value = localStorage.getItem('rz_tg') || ''; } catch { /* хранилище недоступно */ }
  if (tgInput) tgInput.addEventListener('input', () => { tgInput.removeAttribute('aria-invalid'); });

  // Идемпотентность: один ключ на тариф + способ оплаты в течение 30 минут — повтор не плодит счета (воркер вернёт тот же).
  const CK = 'rz_checkout';
  const KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;
  const ORDER_RE = /^[0-9a-f]{32}$/;
  let memRef = null;
  const readRef = () => { try { return JSON.parse(sessionStorage.getItem(CK) || 'null'); } catch { return null; } };
  const saveRef = (ref) => { memRef = ref; try { sessionStorage.setItem(CK, JSON.stringify(ref)); } catch { /* ключ живёт в памяти */ } };
  const checkoutRef = (tariff, method) => {
    const saved = readRef() || memRef;
    if (saved && saved.tariff === tariff && saved.method === method && KEY_RE.test(saved.key || '') && Date.now() - saved.at < 30 * 60 * 1000) return saved;
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const ref = { key: Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join(''), tariff, method, order_id: '', at: Date.now() };
    saveRef(ref);
    return ref;
  };

  const pricing = document.getElementById('pricing');
  if (pricing && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) warmCheckout(); }).observe(pricing);
  }
  let lastMethod = null;
  const methods = $$('.pay-method', dlg);
  const setBusy = (on, m) => {
    working = on;
    dlg.classList.toggle('is-busy', on);
    methods.forEach((b) => { b.disabled = on; b.removeAttribute('aria-busy'); });
    if (on && m) m.setAttribute('aria-busy', 'true');
  };
  const badEmail = () => {
    if (emailInput) { emailInput.setAttribute('aria-invalid', 'true'); emailInput.focus(); }
    say('Укажите действующую почту — на неё придёт чек Lava.', 'error');
  };
  const checkout = async (m) => {
    if (!selectedTariff || working) return;
    const email = emailInput ? emailInput.value.trim() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) { badEmail(); return; }
    try { localStorage.setItem('rz_email', email); } catch { /* ok */ }
    const tg = tgInput ? tgInput.value.trim().replace(/^https?:\/\/t\.me\//i, '') : '';
    if (tg && !TG_RE.test(tg)) {
      tgInput.setAttribute('aria-invalid', 'true');
      say('Юзернейм Telegram: 5–32 символа, латиница, цифры и «_» (например @rustomizator). Или оставьте поле пустым.', 'error');
      tgInput.focus();
      return;
    }
    try { localStorage.setItem('rz_tg', tg); } catch { /* ok */ }
    lastMethod = m;
    const method = m.dataset.method;
    setBusy(true, m);
    say('Создаём счёт на оплату… Обычно до 5 секунд, иногда до 30 — не закрывайте окно.', 'info');
    const ref = checkoutRef(selectedTariff, method);
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), CHECKOUT_TIMEOUT_MS);
    let data = null;
    let timedOut = false;
    try {
      const res = await fetch(LICENSE_API + '/api/checkout', {
        signal: abort.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // method — чтобы воркер запросил у Lava именно этот способ; currency — для старых версий воркера.
        body: JSON.stringify({
          tariff: selectedTariff,
          method,
          currency: CURRENCY[method] || 'RUB',
          client_token: clientToken(),
          email,
          tg_username: tg || undefined,
          idempotency_key: ref.key,
          order_id: ORDER_RE.test(ref.order_id || '') ? ref.order_id : undefined,
        }),
        cache: 'no-store',
      });
      data = await res.json().catch(() => null);
      if (!res.ok && data) data.ok = false;
    } catch {
      data = null;
      timedOut = abort.signal.aborted;
    } finally {
      clearTimeout(timer);
    }
    const order = data && (data.order_id || data.session);
    if (ORDER_RE.test(order || '')) { ref.order_id = order; saveRef(ref); }
    const url = data && data.ok ? (typeof data.url === 'string' ? data.url : data.payment_url) : '';
    if (typeof url === 'string' && /^https:\/\//.test(url)) {
      // Номер сессии запоминаем: если вкладка закроется после оплаты, ключ откроется на download.html без ссылки.
      try { localStorage.setItem('rz_session', String(data.session || order || '')); localStorage.setItem('rz_pending', '1'); } catch { /* хранилище недоступно */ }
      window.location.href = url; // сразу, та же вкладка: Lava вернёт покупателя на сайт сама
      return;
    }
    setBusy(false);
    say('', '');
    const code = data && data.code;
    if (code === 'bad_email') { badEmail(); return; }
    payError(timedOut ? 'timeout' : code, m, !data || timedOut || code === 'lava_error');
  };
  methods.forEach((m) => m.addEventListener('click', () => checkout(m)));
  // Возврат кнопкой «Назад» с Lava: страница из кэша браузера не должна остаться с заблокированными кнопками.
  window.addEventListener('pageshow', (e) => { if (e.persisted) { setBusy(false); say('', ''); } });

  /* Окно ошибки: «Повторить» (тот же ключ идемпотентности) и «Написать в поддержку». Esc закрывает только его. */
  const alertDlg = $('#pay-error');
  const TEXTS = {
    default: 'Попробуйте ещё раз или напишите нам в поддержку — поможем оформить оплату вручную.',
    not_configured: 'Оплата временно недоступна. Напишите в поддержку — оформим вручную.',
    rate_limited: 'Слишком много попыток подряд. Подождите пару минут и нажмите «Повторить» или напишите в поддержку.',
    bad_tariff: 'Не удалось определить тариф. Обновите страницу или напишите в поддержку — оформим вручную.',
    timeout: 'Платёжная система не ответила за 30 секунд. Можно оплатить сразу на lava.top напрямую, нажать «Повторить» или написать в поддержку.',
  };
  const NO_RETRY = new Set(['not_configured', 'bad_tariff']);
  let backTo = null;
  function payError(code, from, offerDirect) {
    if (!alertDlg || typeof alertDlg.showModal !== 'function') { say(TEXTS[code] || TEXTS.default, 'error'); return; }
    backTo = from;
    const retry = $('[data-retry]', alertDlg);
    $('#pay-error-text', alertDlg).textContent = TEXTS[code] || TEXTS.default;
    retry.hidden = NO_RETRY.has(code);
    const direct = $('[data-direct]', alertDlg);
    const showDirect = !!(offerDirect && selectedPlanUrl);
    if (direct) { direct.hidden = !showDirect; if (showDirect) direct.href = selectedPlanUrl; }
    alertDlg.showModal();
    (showDirect ? direct : retry.hidden ? $('[data-support-link]', alertDlg) : retry).focus();
  }
  if (alertDlg && typeof alertDlg.showModal === 'function') {
    alertDlg.addEventListener('close', () => { if (dlg.open && backTo && document.contains(backTo)) backTo.focus(); });
    // Chrome объединяет окна, открытые без нового действия пользователя, и одно Esc закрыло бы и ошибку, и окно оплаты.
    // Поэтому Esc при открытой ошибке перехватываем на keydown и закрываем только её.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !alertDlg.open) return;
      e.preventDefault();
      e.stopPropagation();
      alertDlg.close();
    }, true);
    dlg.addEventListener('cancel', (e) => { if (alertDlg.open) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    $('.pay-x', alertDlg).addEventListener('click', () => alertDlg.close());
    alertDlg.addEventListener('click', (e) => { if (e.target === alertDlg) alertDlg.close(); });
    $('[data-retry]', alertDlg).addEventListener('click', () => {
      alertDlg.close();
      if (lastMethod) checkout(lastMethod);
    });
  }
})();

/* Если Lava вернула покупателя на главную (а не на download.html), но дописала токен заказа или номер счёта (`session`, `invoiceId`),
   переносим его на страницу выдачи с теми же параметрами — ключ покажется без ручных действий. Сам по себе принудительных
   перенаправлений на «/» на сайте нет. */
(function lavaReturn() {
  if (/download\.html$/.test(location.pathname)) return;
  const q = decodeURIComponent(location.search);
  if (/(?:^|[?&])(?:session|invoiceId|invoice_id|contractId)=/i.test(q)) location.replace('download.html' + location.search);
})();

/* Возврат из Lava после отмены или неудачной оплаты: ?pay=cancel|failed#pricing — убираем параметр, остаёмся у тарифов. */
(function payReturn() {
  const params = new URLSearchParams(location.search);
  if (!params.has('pay')) return;
  history.replaceState(null, '', location.pathname + (location.hash || '#pricing'));
})();

/* =====================================================================
   Модуль: интро — заголовок по словам, лесенка задержек, старт после шрифтов
   ===================================================================== */
(function intro() {
  $$('[data-split]').forEach((node) => {
    const out = document.createDocumentFragment();
    const wrapWord = (inner) => {
      inner.classList.add('w-in', 'intro');
      const w = el('span', 'w');
      w.append(inner);
      out.append(w);
    };
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        // Делим только по обычным пробелам: «в&nbsp;Rust» остаётся одним словом.
        child.textContent.split(/([ \t\n]+)/).forEach((part) => {
          if (!part) return;
          if (/^[ \t\n]+$/.test(part)) out.append(document.createTextNode(' '));
          else wrapWord(el('span', null, part));
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWord(child);
      }
    });
    node.replaceChildren(out);
  });

  $$('.intro').forEach((n, i) => n.style.setProperty('--intro-d', 180 + i * 70 + 'ms'));

  const start = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    html.classList.add('is-ready');
    readyCallbacks.splice(0).forEach((cb) => cb());
  }));
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, wait(700)]).then(start);
})();

/* =====================================================================
   Модуль: появление при прокрутке
   ===================================================================== */
const onReveal = new Map(); // элемент → колбэк при первом появлении

(function setupReveal() {
  // Порядковые номера для лесенок внутри плиток (полосы категорий, уровни буста, таймлайн).
  [['.cats li'], ['.levels .lvl-bar'], ['.timeline i']].forEach(([sel]) => {
    $$(sel).forEach((n, i) => n.style.setProperty('--k', i));
  });

  const items = $$('.reveal');
  const counters = new Map();
  items.forEach((node) => {
    const i = counters.get(node.parentElement) || 0;
    node.style.setProperty('--delay', Math.min(i, 6) * 90 + 'ms');
    counters.set(node.parentElement, i + 1);
  });

  const show = (node) => {
    node.classList.add('is-in');
    // После появления задержка не нужна — иначе ховер отзывался бы с опозданием.
    const delay = parseFloat(node.style.getPropertyValue('--delay')) || 0;
    setTimeout(() => node.style.setProperty('--delay', '0ms'), delay + 1000);
    const cb = onReveal.get(node);
    if (cb) { onReveal.delete(node); cb(); }
  };

  if (!('IntersectionObserver' in window)) {
    requestAnimationFrame(() => items.forEach(show));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach((node) => io.observe(node));
})();

/* =====================================================================
   Модуль: фон — кибер-сетка с подсветкой у курсора, бегущие импульсы, туманности с параллаксом
   ===================================================================== */
(function cyberBg() {
  const root = $('.bg');
  if (!root) return;
  const grid = $('.bg-grid', root);
  const cv = $('.bg-fx', root);
  const ctx = cv && !html.classList.contains('fx-nocanvas') ? cv.getContext('2d') : null;
  const CELL = 64;   // = --cell в styles.css
  const PAR = 0.22;  // сетка едет медленнее страницы — кажется дальше
  const R = 240;     // радиус подсветки у курсора

  let W = 0;
  let H = 0;
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    if (cv && !lowFx.matches) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  };
  resize();
  window.addEventListener('resize', resize);

  const ptr = { x: W * 0.6, y: H * 0.35, sx: W * 0.6, sy: H * 0.35, on: false, a: 0 };
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      if (!ptr.on && ptr.a < 0.02) { ptr.sx = ptr.x; ptr.sy = ptr.y; }
      ptr.on = true;
    }, { passive: true });
    html.addEventListener('pointerleave', () => { ptr.on = false; });
    window.addEventListener('blur', () => { ptr.on = false; });
  }

  let scroll = window.scrollY;
  window.addEventListener('scroll', () => { scroll = window.scrollY; }, { passive: true });

  // Туманности плавают вокруг своих мест: смещение — гладкая функция прокрутки, с инерцией.
  const nebs = $$('.neb', root).map((n, i) => ({ n, x: 0, y: 0, ph: i * 1.9, amp: 54 + i * 20 }));

  const COLORS = ['0, 242, 254', '155, 92, 255', '79, 172, 254'];
  const beams = [];
  let nextBeam = 900;
  const spawn = (offAbs) => {
    const horiz = Math.random() < 0.6;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const len = 120 + Math.random() * 180;
    const lim = horiz ? W : H;
    const lineIdx = horiz
      ? Math.floor(offAbs / CELL) + 1 + Math.floor(Math.random() * Math.max(1, H / CELL - 1))
      : 1 + Math.floor(Math.random() * Math.max(1, W / CELL - 1));
    beams.push({
      horiz, dir, len,
      line: lineIdx * CELL,
      p: dir > 0 ? -len : lim + len,
      speed: 240 + Math.random() * 280,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  };

  const drawHot = (off) => {
    const { sx, sy, a } = ptr;
    const x0 = Math.floor((sx - R) / CELL) * CELL;
    const y0 = Math.floor((sy - R + off) / CELL) * CELL - off;
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(0, 242, 254, ${0.6 * a})`;
    ctx.beginPath();
    for (let x = x0; x <= sx + R; x += CELL) { ctx.moveTo(x + 0.5, sy - R); ctx.lineTo(x + 0.5, sy + R); }
    for (let y = y0; y <= sy + R; y += CELL) { ctx.moveTo(sx - R, y + 0.5); ctx.lineTo(sx + R, y + 0.5); }
    ctx.stroke();
    ctx.fillStyle = `rgba(190, 252, 255, ${0.95 * a})`;
    for (let x = x0; x <= sx + R; x += CELL) for (let y = y0; y <= sy + R; y += CELL) ctx.fillRect(x - 1, y - 1, 3, 3);
    // Гасим всё дальше радиуса — остаётся круг подсвеченной сетки.
    ctx.globalCompositeOperation = 'destination-in';
    const mask = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
    mask.addColorStop(0, 'rgba(0, 0, 0, 1)');
    mask.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    mask.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 1.4);
    glow.addColorStop(0, `rgba(0, 242, 254, ${0.085 * a})`);
    glow.addColorStop(0.5, `rgba(155, 92, 255, ${0.035 * a})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - R * 1.4, sy - R * 1.4, R * 2.8, R * 2.8);
  };

  const drawBeam = (b, offAbs) => {
    const tail = b.p - b.dir * b.len;
    let x0; let y0; let x1; let y1;
    if (b.horiz) { const y = b.line - offAbs + 0.5; x0 = tail; x1 = b.p; y0 = y; y1 = y; }
    else { const x = b.line + 0.5; y0 = tail; y1 = b.p; x0 = x; x1 = x; }
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, `rgba(${b.color}, 0)`);
    g.addColorStop(0.75, `rgba(${b.color}, 0.55)`);
    g.addColorStop(1, 'rgba(230, 255, 255, 0.95)');
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = `rgba(${b.color}, 0.9)`;
    ctx.beginPath();
    ctx.arc(x1, y1, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  let last = 0;
  let lastOff = -1;
  let running = true;
  // Статичный фон: сетка и туманности на своих местах, canvas очищен и скрыт CSS; цикл кадров останавливается.
  const settleStatic = () => {
    if (grid) grid.style.transform = 'translate3d(0, 0, 0)';
    nebs.forEach((o) => { o.x = 0; o.y = 0; o.n.style.transform = ''; });
    if (ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    beams.length = 0;
    lastOff = -1;
    last = 0;
  };
  const frame = (now) => {
    if (lowFx.matches) { running = false; settleStatic(); return; }
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    const offAbs = scroll * PAR;
    const off = offAbs % CELL;
    if (grid && Math.abs(off - lastOff) > 0.01) {
      grid.style.transform = `translate3d(0, ${(-off).toFixed(2)}px, 0)`;
      lastOff = off;
    }

    const kN = damp(dt, 2.2);
    nebs.forEach((o) => {
      const tx = Math.cos(scroll / 1100 + o.ph) * o.amp * 0.8;
      const ty = Math.sin(scroll / 900 + o.ph) * o.amp;
      if (Math.abs(tx - o.x) + Math.abs(ty - o.y) < 0.05) return;
      o.x += (tx - o.x) * kN;
      o.y += (ty - o.y) * kN;
      o.n.style.transform = `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, 0)`;
    });

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ptr.a += ((ptr.on ? 1 : 0) - ptr.a) * damp(dt, 4);
      const kP = damp(dt, 12);
      ptr.sx += (ptr.x - ptr.sx) * kP;
      ptr.sy += (ptr.y - ptr.sy) * kP;
      if (ptr.a > 0.01) drawHot(off);

      nextBeam -= dt * 1000;
      if (nextBeam <= 0) {
        if (beams.length < 7) spawn(offAbs);
        nextBeam = 650 + Math.random() * 1100;
      }
      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i];
        b.p += b.dir * b.speed * dt;
        const lim = b.horiz ? W : H;
        if ((b.dir > 0 && b.p - b.len > lim) || (b.dir < 0 && b.p + b.len < 0)) { beams.splice(i, 1); continue; }
        drawBeam(b, offAbs);
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  // Окно ПК сузили до планшета или обратно: цикл останавливается сам, а при возврате запускается заново.
  lowFx.addEventListener('change', () => {
    if (lowFx.matches || running) return;
    resize();
    running = true;
    requestAnimationFrame(frame);
  });
})();

/* =====================================================================
   Модуль: 3D-окно в hero — наклон за курсором с инерцией и блик на стекле
   ===================================================================== */
(function heroWindow() {
  const hero = $('.hero');
  const win = $('#demo-window');
  if (!hero || !win) return;
  const glare = $('.aw-glare i', win);
  const sheen = $('.aw-glare b', win);
  const narrow = window.matchMedia('(max-width: 1024px)');
  const base = () => (narrow.matches ? { rx: 4, ry: 0 } : { rx: 6, ry: -12 });

  const cur = { ...base(), gx: 0.5, gy: 0.3, go: 0 };
  const tgt = { ...cur };
  let raf = 0;
  let last = 0;
  const write = () => {
    win.style.transform = `rotateX(${cur.rx.toFixed(3)}deg) rotateY(${cur.ry.toFixed(3)}deg)`;
    glare.style.transform = `translate3d(${((cur.gx - 0.5) * 50).toFixed(2)}%, ${((cur.gy - 0.5) * 50).toFixed(2)}%, 0)`;
    glare.style.opacity = cur.go.toFixed(3);
    sheen.style.transform = `translate3d(${((0.5 - cur.gx) * 40).toFixed(2)}%, 0, 0)`;
  };
  const step = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    const k = damp(dt, 5.5);
    let moving = false;
    for (const key of ['rx', 'ry', 'gx', 'gy', 'go']) {
      const d = tgt[key] - cur[key];
      if (Math.abs(d) > 0.001) moving = true;
      cur[key] += d * k;
    }
    write();
    if (moving) raf = requestAnimationFrame(step);
    else { raf = 0; last = 0; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  write();

  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = win.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      const nx = clamp((e.clientX - (r.left + r.width / 2)) / (h.width / 2), -1, 1);
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / (h.height / 2), -1, 1);
      const b = base();
      tgt.ry = b.ry * 0.35 + nx * 16;
      tgt.rx = b.rx * 0.35 - ny * 11;
      tgt.gx = clamp((e.clientX - r.left) / r.width, -0.3, 1.3);
      tgt.gy = clamp((e.clientY - r.top) / r.height, -0.3, 1.3);
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      tgt.go = inside ? 1 : 0.4;
      kick();
    });
    hero.addEventListener('pointerleave', () => { Object.assign(tgt, base(), { go: 0 }); kick(); });
  }
  narrow.addEventListener('change', () => { Object.assign(tgt, base()); kick(); });
})();

/* =====================================================================
   Модуль: демо окна — тумблеры категорий, шкала готовности на пружине, «живой» таймер
   ===================================================================== */
(function heroDemo() {
  const gauge = $('#g-gauge');
  if (!gauge) return;
  const fill = $('#g-fill');
  const glow = $('#g-glow');
  const dot = $('#g-dot');
  const num = $('#g-num');
  const ticks = $('#g-ticks');
  const status = $('#g-status');
  const cta = $('#g-cta');
  const ctaText = $('#g-cta-text');
  const note = $('#g-note');
  const timer = $('#g-timer');
  const onCount = $('#g-on');
  const rows = $$('#g-toggles li');
  const sws = rows.map((li) => $('.sw', li));
  const W = sws.map((b) => Number(b.dataset.w) || 0);
  const TOTAL = W.reduce((a, b) => a + b, 0) || 1;
  $('#g-total').textContent = String(TOTAL);

  const FROM = 20;  // как на скриншоте «до»
  const TO = 100;   // как на скриншоте «после»
  const C = 60;
  const R = 50;
  const START = 135;
  const SWEEP = 270;
  const polar = (deg, r = R) => {
    const a = (deg * Math.PI) / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };

  // Засечки шкалы — загораются по очереди при «включении».
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i <= 40; i++) {
    const major = i % 5 === 0;
    const ang = START + (SWEEP * i) / 40;
    const [x0, y0] = polar(ang, 42);
    const [x1, y1] = polar(ang, major ? 35 : 38);
    const ln = document.createElementNS(ns, 'line');
    ln.setAttribute('x1', x0.toFixed(2)); ln.setAttribute('y1', y0.toFixed(2));
    ln.setAttribute('x2', x1.toFixed(2)); ln.setAttribute('y2', y1.toFixed(2));
    if (major) ln.setAttribute('class', 'major');
    ln.style.setProperty('--td', i * 22 + 'ms');
    ticks.append(ln);
  }

  // Тона и вердикты — как в интерфейсе (ScoreGauge.tsx, i18n dash.verdict.*).
  const TONES = { bad: ['#ff5252', '#ff9100'], warn: ['#ff9100', '#ffd54a'], info: ['#0284c7', '#0052cc'], ok: ['#00e676', '#0284c7'] };
  const VERDICT = {
    bad: 'Система засорена и имеет высокий input lag',
    warn: 'Есть что улучшить',
    info: 'Неплохо, но можно лучше',
    ok: 'Система готова к игре',
  };
  const toneOf = (v) => (v < 40 ? 'bad' : v < 60 ? 'warn' : v < 80 ? 'info' : 'ok');

  let statusTimer = 0;
  const setStatus = (text, instant) => {
    clearTimeout(statusTimer);
    if (instant) { status.textContent = text; return; }
    status.classList.add('is-swapping');
    statusTimer = setTimeout(() => { status.textContent = text; status.classList.remove('is-swapping'); }, 220);
  };
  const burst = () => {
    gauge.classList.remove('is-burst');
    void gauge.offsetWidth; // перезапуск анимации
    gauge.classList.add('is-burst');
  };

  let tone = '';
  const paint = (v) => {
    const p = clamp(v, 0, 100);
    fill.style.strokeDasharray = `${p.toFixed(2)} 100`;
    glow.style.strokeDasharray = `${p.toFixed(2)} 100`;
    const [x, y] = polar(START + (SWEEP * p) / 100);
    dot.setAttribute('cx', x.toFixed(2));
    dot.setAttribute('cy', y.toFixed(2));
    num.textContent = String(Math.round(p));
    const t = toneOf(Math.round(p));
    if (t !== tone) {
      const first = !tone;
      tone = t;
      gauge.style.setProperty('--g-from', TONES[t][0]);
      gauge.style.setProperty('--g-to', TONES[t][1]);
      gauge.classList.toggle('is-lit', t === 'ok');
      gauge.setAttribute('aria-label', `Готовность ПК: ${VERDICT[t]}`);
      setStatus(VERDICT[t], first);
      if (t === 'ok' && !first) burst();
    }
  };

  // Пружина как у гейджа в приложении (stiffness 64, damping 15).
  const on = sws.map(() => false);
  const sumOn = () => on.reduce((s, v, i) => s + (v ? W[i] : 0), 0);
  let shown = FROM;
  let vel = 0;
  let target = FROM;
  let raf = 0;
  let last = 0;
  const step = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    vel += (64 * (target - shown) - 15 * vel) * dt;
    shown += vel * dt;
    if (Math.abs(target - shown) < 0.02 && Math.abs(vel) < 0.02) {
      shown = target;
      vel = 0;
      paint(shown);
      raf = 0;
      last = 0;
      return;
    }
    paint(shown);
    raf = requestAnimationFrame(step);
  };
  const kick = () => {
    target = FROM + ((TO - FROM) * sumOn()) / TOTAL;
    if (!raf) raf = requestAnimationFrame(step);
  };

  let running = false;
  let seq = 0;
  let snapshotAt = '';
  const renderRow = (i) => {
    sws[i].setAttribute('aria-checked', String(on[i]));
    rows[i].classList.toggle('is-on', on[i]);
  };
  const updateMeta = () => {
    const n = sumOn();
    onCount.textContent = String(n);
    if (n > 0 && !snapshotAt) snapshotAt = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    note.textContent = snapshotAt ? `Снимок исходного состояния: сегодня, ${snapshotAt}` : 'Снимок создаётся автоматически перед первым изменением';
    if (!running) {
      const all = on.every(Boolean);
      ctaText.textContent = all ? 'Всё оптимизировано' : '⚡ Оптимизировать в 1 клик';
      cta.classList.toggle('is-done', all);
    }
  };

  // «Оптимизировать в 1 клик»: включает оставшиеся категории по очереди; повторное нажатие — заново с нуля.
  const runAll = async () => {
    const my = ++seq;
    running = true;
    cta.classList.remove('is-done');
    cta.classList.add('is-pressed');
    setTimeout(() => cta.classList.remove('is-pressed'), 160);
    if (on.every(Boolean)) {
      on.forEach((_, i) => { on[i] = false; renderRow(i); });
      updateMeta();
      kick();
      await wait(800);
      if (my !== seq) return;
    }
    const todo = on.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    const total = todo.reduce((s, i) => s + W[i], 0);
    let done = 0;
    ctaText.textContent = `Применяю… 0 из ${total}`;
    for (const i of todo) {
      await wait(done ? 340 : 260);
      if (my !== seq) return;
      on[i] = true;
      renderRow(i);
      done += W[i];
      ctaText.textContent = `Применяю… ${done} из ${total}`;
      updateMeta();
      kick();
    }
    await wait(420);
    if (my !== seq) return;
    running = false;
    updateMeta();
  };

  rows.forEach((li, i) => {
    li.addEventListener('click', () => {
      if (running) { seq++; running = false; }
      on[i] = !on[i];
      renderRow(i);
      updateMeta();
      kick();
    });
  });
  cta.addEventListener('click', () => { if (!running) runAll(); });

  // Редкое короткое мерцание цифр таймера — «живой» неон.
  const glitchLoop = () => {
    setTimeout(() => {
      timer.classList.add('is-glitch');
      setTimeout(() => timer.classList.remove('is-glitch'), 260);
      glitchLoop();
    }, 3500 + Math.random() * 5000);
  };

  paint(FROM);
  updateMeta();
  onReady(() => {
    setTimeout(() => {
      gauge.classList.add('is-ignited');
      timer.classList.add('is-on', 'is-igniting');
      setTimeout(() => timer.classList.remove('is-igniting'), 1200);
      glitchLoop();
    }, 1500);
    setTimeout(() => { if (!running && sumOn() === 0) runAll(); }, 2100);
  });
})();

/* =====================================================================
   Модуль: сравнение «до / после»
   ===================================================================== */
(function compare() {
  const box = $('#compare-box');
  if (!box) return;
  const range = $('.cmp-range', box);
  const set = () => box.style.setProperty('--pos', range.value + '%');
  let touched = false;
  range.addEventListener('input', () => { touched = true; set(); });
  range.addEventListener('pointerdown', () => { touched = true; });
  set();

  // Счётчик «после»: при появлении балл реактора растёт с «до» до «после», кольцо прогресса заполняется вместе с ним.
  const num = $('[data-count-to]', box);
  if (num) box.classList.add('is-counting');
  const countUp = () => {
    if (!num) return;
    const from = Number(num.dataset.countFrom), to = Number(num.dataset.countTo);
    num.textContent = String(from);
    setTimeout(() => {
      box.classList.remove('is-counting');
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        num.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 500);
  };

  // Один раз при появлении разделитель сам проезжает: «после» → «до» → середина, чтобы были видны оба состояния.
  onReveal.set(box, () => {
    countUp();
    const keys = [[0, 50], [900, 92], [2100, 8], [3000, 50]]; // [мс, позиция %]
    const start = performance.now() + 400;
    const tick = (t) => {
      if (touched) return;
      const e = t - start;
      if (e < 0) { requestAnimationFrame(tick); return; }
      let i = 1;
      while (i < keys.length - 1 && e > keys[i][0]) i++;
      const [t0, p0] = keys[i - 1];
      const [t1, p1] = keys[i];
      const k = Math.min(1, Math.max(0, (e - t0) / (t1 - t0)));
      const s = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
      range.value = String(p0 + (p1 - p0) * s);
      set();
      if (e < keys[keys.length - 1][0]) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
})();

/* =====================================================================
   Модуль: плитки — подъём на 6 px и наклон за курсором, с инерцией
   ===================================================================== */
(function tiltCards() {
  if (!finePointer) return;
  $$('[data-tilt]').forEach((node) => {
    const max = Number(node.dataset.tiltMax) || 4;
    const cur = { rx: 0, ry: 0, y: 0 };
    const tgt = { rx: 0, ry: 0, y: 0 };
    let raf = 0;
    let last = 0;
    const step = (now) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const k = damp(dt, 8);
      let moving = false;
      for (const key of ['rx', 'ry', 'y']) {
        const d = tgt[key] - cur[key];
        if (Math.abs(d) > 0.002) moving = true;
        cur[key] += d * k;
      }
      if (!moving) Object.assign(cur, tgt);
      const rest = !moving && !cur.rx && !cur.ry && !cur.y;
      node.style.transform = rest ? '' : `translate3d(0, ${cur.y.toFixed(2)}px, 0) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      if (moving) raf = requestAnimationFrame(step);
      else { raf = 0; last = 0; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    node.addEventListener('pointerenter', () => { tgt.y = -6; kick(); });
    node.addEventListener('pointermove', (e) => {
      const r = node.getBoundingClientRect();
      tgt.rx = (0.5 - (e.clientY - r.top) / r.height) * max;
      tgt.ry = ((e.clientX - r.left) / r.width - 0.5) * max;
      kick();
    });
    node.addEventListener('pointerleave', () => { tgt.rx = 0; tgt.ry = 0; tgt.y = 0; kick(); });
  });
})();

/* =====================================================================
   Модуль: spotlight — подсветка границ карточек под курсором
   ===================================================================== */
(function spotlight() {
  if (!finePointer) return;
  $$('[data-spotlight]').forEach((group) => {
    const cards = $$('.glass', group);
    let raf = 0;
    let px = 0;
    let py = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (px - r.left).toFixed(0) + 'px');
        card.style.setProperty('--my', (py - r.top).toFixed(0) + 'px');
      });
    };
    group.addEventListener('pointerenter', () => group.classList.add('is-lit'));
    group.addEventListener('pointerleave', () => group.classList.remove('is-lit'));
    group.addEventListener('pointermove', (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    });
  });
})();

/* =====================================================================
   Модуль: страховка для слабых видеокарт
   Самое дорогое на странице — размытие под стеклом карточек. Если после интро кадры регулярно пропускаются
   (≥ 6 из 90 заметно дольше обычного), класс fx-lite снимает это размытие; анимации и свечения остаются.
   ===================================================================== */
(function fxGovernor() {
  onReady(() => setTimeout(() => {
    if (lowFx.matches) return;
    const d = [];
    let last = 0;
    const loop = (t) => {
      if (last) d.push(t - last);
      last = t;
      if (d.length >= 90) {
        const med = d.slice().sort((a, b) => a - b)[d.length >> 1];
        const drops = d.filter((x) => x > med * 1.7 && x > 20).length;
        d.length = 0;
        if (drops >= 6) { html.classList.add('fx-lite'); return; }
      }
      requestAnimationFrame(loop);
    };
    // Вкладка в фоне не рисует кадры — после возврата начинаем окно заново, чтобы паузу не счесть пропуском.
    document.addEventListener('visibilitychange', () => { last = 0; d.length = 0; });
    requestAnimationFrame(loop);
  }, 3000));
})();

/* =====================================================================
   Модуль: фреймтайм — только из настоящего замера (CONFIG.measurements)
   ===================================================================== */
(function frametime() {
  const m = CONFIG.measurements;
  const box = $('#frametime');
  const svg = $('#ft-chart');
  if (!box || !svg || !m || !Array.isArray(m.before) || !Array.isArray(m.after) || !m.before.length || !m.after.length) return;

  const W = 800;
  const H = 220;
  const all = m.before.concat(m.after);
  const maxV = Math.max(...all) * 1.1;
  const ns = 'http://www.w3.org/2000/svg';
  const pathOf = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${((i / (arr.length - 1)) * W).toFixed(1)},${(H - (v / maxV) * H).toFixed(1)}`).join(' ');

  for (let i = 1; i < 4; i++) {
    const ln = document.createElementNS(ns, 'line');
    ln.setAttribute('class', 'grid-ln');
    ln.setAttribute('x1', '0'); ln.setAttribute('x2', String(W));
    ln.setAttribute('y1', String((H / 4) * i)); ln.setAttribute('y2', String((H / 4) * i));
    svg.append(ln);
  }
  [['ln-before', m.before], ['ln-after', m.after]].forEach(([cls, arr]) => {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('class', cls);
    p.setAttribute('d', pathOf(arr));
    svg.append(p);
  });

  $('#ft-meta').textContent = [m.rig, m.method].filter(Boolean).join(' · ');
  const stats = $('#ft-stats');
  (m.stats || []).forEach((s) => {
    const row = el('div');
    row.append(el('dt', null, s.label));
    row.append(el('dd', null, `${s.before} → ${s.after}`));
    stats.append(row);
  });
  box.hidden = false;
  const pending = $('#ft-pending');
  if (pending) pending.textContent = 'Данные замера: ' + (m.rig || 'конфигурация указана выше') + '.';
})();

/* =====================================================================
   Модуль: инерционная прокрутка колесом мыши
   scroll-behavior: smooth не сглаживает колесо — каждый щелчок прыгает на ~100 px. Здесь щелчок сдвигает ЦЕЛЬ, а позиция
   догоняет её по экспоненте (как в Lenis, без библиотек). Кадры запрашиваются только во время движения; шаг не зависит от
   частоты монитора. Тачпад, Ctrl/Shift+колесо и телефоны (pointer: coarse) — нативно. Сдвинули полосой или клавишами —
   анимация уступает. Тот же механизм, что в приложении (src/lib/smoothWheel.ts).
   ===================================================================== */
(function smoothWheel() {
  if (!window.matchMedia || matchMedia('(pointer: coarse)').matches) return;
  const TAU = 90;
  const root = document.scrollingElement || document.documentElement;
  const motions = new Map();
  const max = (el) => Math.max(0, el.scrollHeight - el.clientHeight);
  const mouse = (e) => {
    if (e.deltaMode !== 0) return true;
    if (typeof e.wheelDeltaY === 'number' && e.wheelDeltaY !== 0) return Math.abs(e.wheelDeltaY) >= 120 && e.wheelDeltaY % 120 === 0;
    return Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY);
  };
  const scrollable = (el) => {
    if (max(el) < 1) return false;
    if (el === root) return true;
    const o = getComputedStyle(el).overflowY;
    return o === 'auto' || o === 'scroll' || o === 'overlay';
  };
  const pick = (node, dir) => {
    for (; node; node = node === root ? null : node.parentElement) {
      if (!scrollable(node)) continue;
      const target = motions.has(node) ? motions.get(node).target : node.scrollTop;
      if (dir > 0 ? target < max(node) - 0.5 : target > 0.5) return node;
    }
    return null;
  };
  const step = (el) => {
    const m = motions.get(el);
    if (!m) return;
    m.raf = 0;
    if (!el.isConnected || Math.abs(el.scrollTop - m.written) > 3) { motions.delete(el); return; }
    const t = performance.now();
    const dt = Math.min(64, Math.max(0, t - m.last));
    m.last = t;
    m.target = Math.min(Math.max(m.target, 0), max(el));
    m.pos += (m.target - m.pos) * (1 - Math.exp(-dt / TAU));
    if (Math.abs(m.target - m.pos) < 0.5) m.pos = m.target;
    el.scrollTo({ top: m.pos, behavior: 'instant' });
    m.written = el.scrollTop;
    if (m.pos === m.target) motions.delete(el);
    else m.raf = requestAnimationFrame(() => step(el));
  };
  window.addEventListener('wheel', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.shiftKey || !e.deltaY || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !mouse(e)) return;
    const origin = e.target instanceof Element ? e.target : null;
    if (origin && origin.closest('[data-native-scroll], select, textarea')) return;
    const el = pick(origin || root, Math.sign(e.deltaY));
    if (!el) return;
    e.preventDefault();
    let m = motions.get(el);
    if (!m) { m = { target: el.scrollTop, pos: el.scrollTop, written: el.scrollTop, raf: 0, last: 0 }; motions.set(el, m); }
    const px = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * el.clientHeight : e.deltaY;
    m.target = Math.min(Math.max(m.target + px, 0), max(el));
    if (!m.raf) { m.last = performance.now(); m.raf = requestAnimationFrame(() => step(el)); }
  }, { passive: false });
})();

/* Оплату начали, а ключ ещё не показан (вернулись не по ссылке Lava, закрыли вкладку, платили в приложении банка): на любой
   странице сайта токен браузера спрашивает сервер, и как только заказ оплачен, появляется баннер с ключом и кнопкой скачивания.
   Пока оплата не подтверждена, висит плашка-ссылка на страницу скачивания. Страница download.html показывает ключ сама. */
(function orderBanner() {
  if (/download\.html$/.test(location.pathname)) return;
  const ACK = 'rz_key_ack'; // номер счёта, баннер которого закрыли
  const read = (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };
  const waiting = () => read('rz_pending') === '1';
  let chip = null;

  const showChip = () => {
    if (chip || !waiting()) return;
    chip = document.createElement('a');
    chip.className = 'order-chip';
    chip.href = 'download.html';
    chip.textContent = 'Оплатили? Получить ключ и скачать';
    document.body.append(chip);
  };

  function showKey(d) {
    if (chip) chip.remove();
    const box = document.createElement('aside');
    box.className = 'order-win';
    box.setAttribute('role', 'status');
    const title = document.createElement('p');
    title.className = 'order-win-title';
    title.textContent = 'Оплата подтверждена! Ваш ключ:';
    const code = document.createElement('code');
    code.className = 'order-win-key';
    code.textContent = d.key;
    const row = document.createElement('div');
    row.className = 'order-win-row';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn btn-ghost';
    copy.textContent = 'Скопировать';
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(d.key); copy.textContent = 'Скопировано'; } catch { copy.textContent = 'Выделите ключ'; }
      setTimeout(() => { copy.textContent = 'Скопировать'; }, 2000);
    };
    const dl = document.createElement('a');
    dl.className = 'btn btn-primary';
    dl.textContent = 'Скачать';
    dl.href = typeof d.download_url === 'string' && /^https:\/\//.test(d.download_url) ? d.download_url : 'download.html';
    dl.rel = 'noopener noreferrer';
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'order-win-x';
    x.setAttribute('aria-label', 'Закрыть');
    x.textContent = '×';
    x.onclick = () => {
      try { localStorage.setItem(ACK, d.invoice_id); localStorage.removeItem('rz_pending'); } catch { /* ok */ }
      box.classList.remove('is-in');
      setTimeout(() => box.remove(), 300);
    };
    row.append(copy, dl);
    box.append(x, title, code, row);
    if (typeof d.session === 'string' && /^[0-9a-f]{32}$/.test(d.session)) box.append(telegramLink(d.session, 'order-win-tg'));
    document.body.append(box);
    requestAnimationFrame(() => box.classList.add('is-in'));
  }

  let tries = 0;
  async function poll() {
    const d = await checkSession();
    if (d && d.success && typeof d.key === 'string') {
      if (read(ACK) !== d.invoice_id) showKey(d);
      return;
    }
    // Оплата идёт: спрашиваем чаще и недолго (до ~10 минут), иначе — одна проверка на загрузку страницы.
    if (d && d.pending || waiting()) {
      showChip();
      if (++tries < 120) setTimeout(poll, 5000);
    }
  }
  poll();
})();


/* =====================================================================
   Отзывы: две бегущие ленты, видеоотзыв открывается в окне
   ===================================================================== */
(function reviews() {
  const rows = $('#rv-rows');
  const list = CONFIG.reviews || [];
  if (!rows || !list.length) return;
  const STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.4 5.2 5.7.6-4.3 3.8 1.2 5.6L10 14.2l-5 2.8 1.2-5.6L1.9 7.6l5.7-.6z"/></svg>';
  const dlg = $('#rv-video');
  const player = dlg ? $('video', dlg) : null;

  const card = (r) => {
    const box = el('article', 'rv-card glass' + (r.video ? ' rv-has-video' : ''));
    const stars = el('div', 'rv-stars');
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', 'Оценка: 5 из 5');
    stars.innerHTML = STAR.repeat(5);
    box.append(stars);
    if (r.video) {
      const open = el('button', 'rv-play');
      open.type = 'button';
      open.setAttribute('aria-label', 'Смотреть видеоотзыв');
      const img = new Image();
      img.src = r.video.poster;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      open.append(img, el('span', 'rv-play-ico'));
      open.addEventListener('click', () => {
        if (!dlg || !player) return;
        player.src = r.video.src;
        if (!dlg.open) dlg.showModal();
        player.play().catch(() => { /* автозапуск запрещён — остаётся кнопка плеера */ });
      });
      box.append(open);
    }
    box.append(el('p', 'rv-text', r.text));
    const who = el('div', 'rv-who');
    who.append(el('b', '', r.nick), el('small', '', 'Покупатель Rustomizator'));
    box.append(who);
    return box;
  };

  // Лента = два одинаковых полукруга (translate на -50% даёт бесшовный круг); в каждом набор повторён дважды, чтобы
  // полукруг был шире экрана. Копии скрыты от скринридеров и от Tab.
  const track = (items, cls, seconds) => {
    const row = el('div', 'rv-row ' + cls);
    row.style.setProperty('--rv-dur', seconds + 's');
    const inner = el('div', 'rv-track');
    for (let copy = 0; copy < 4; copy++) {
      items.forEach((r) => {
        const c = card(r);
        if (copy > 0) { c.setAttribute('aria-hidden', 'true'); c.inert = true; }
        inner.append(c);
      });
    }
    row.append(inner);
    return row;
  };
  const first = list.filter((_, i) => i % 2 === 0);
  const second = list.filter((_, i) => i % 2 === 1);
  rows.append(track(first, 'rv-left', 60 + first.length * 5), track(second, 'rv-right', 56 + second.length * 5));

  if (dlg && player) {
    const stop = () => { player.pause(); player.removeAttribute('src'); player.load(); };
    $('.pay-x', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', stop);
  }
})();
