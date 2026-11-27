// Share the ticket issued after purchase across both delivery routes.
(() => {
  const ru = 'https://ru.rustomizator.com';
  const primary = 'https://rustomizator-license.rustomizator-auth.workers.dev';
  const apex = location.hostname === 'rustomizator.com';
  const local = location.origin === ru;
  let russian = null;
  if (apex) fetch('/cdn-cgi/trace', { cache: 'no-store', signal: AbortSignal.timeout(1200) })
    .then(r => r.ok ? r.text() : '').then(trace => {
      const country = /^loc=([A-Z]{2})$/m.exec(trace);
      if (country) russian = country[1] === 'RU';
    }).catch(() => {});

  function notice(text) {
    let box = document.getElementById('release-download-status');
    if (!box) {
      box = document.createElement('p');
      box.id = 'release-download-status';
      box.setAttribute('role', 'status');
      box.style.cssText = 'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:9999;max-width:90vw;padding:.8rem 1.2rem;border-radius:.8rem;background:#132438;color:white;box-shadow:0 4px 24px #0005';
      document.body.append(box);
    }
    box.textContent = text;
    clearTimeout(notice.timer);
    notice.timer = setTimeout(() => box.remove(), 6500);
  }

  // Pause for at most three seconds before the first byte and between data chunks.
  async function readPrimary(url, options, limit) {
    const controller = new AbortController();
    let timer;
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => controller.abort(), 3000); };
    arm();
    try {
      const response = await fetch(url, { ...options, signal: controller.signal, referrerPolicy: 'no-referrer' });
      if (!response.ok) {
        if (response.status >= 500) throw new TypeError('upstream unavailable');
        // A refused ticket or a purchase validation error is authoritative.
        return new Response(await response.blob(), { status: response.status, headers: response.headers });
      }
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > limit) { controller.abort(); throw new Error('File exceeds supported size'); }
        chunks.push(value);
        arm();
      }
      return new Response(new Blob(chunks), { headers: response.headers });
    } finally { clearTimeout(timer); }
  }

  function save(href) {
    const a = document.createElement('a');
    a.href = href; a.download = 'Rustomizator.exe'; a.rel = 'noreferrer';
    document.body.append(a); a.click(); a.remove();
  }

  function bind(link, raw) {
    const src = new URL(raw, location.origin);
    const match = /^\/api\/release\/file\/([\w-]+\.[\w-]+)$/.exec(src.pathname);
    if (src.origin !== primary || !match) {
      link.href = local && src.origin !== ru ? '/download.html' : raw;
      return;
    }
    const mirror = ru + '/releases/file/' + match[1];
    link.href = local ? mirror : src.href;
    link.rel = 'noreferrer';
    let busy = false;
    link.onclick = async event => {
      if (local || !apex || russian === false || link.href === mirror) return;
      event.preventDefault();
      if (busy) return;
      busy = true;
      try {
        const response = await readPrimary(src.href, { cache: 'no-store' }, 150 * 1024 * 1024);
        if (!response.ok) { notice('Ссылка недоступна. Проверьте ключ на странице загрузки.'); return; }
        const object = URL.createObjectURL(await response.blob());
        save(object); setTimeout(() => URL.revokeObjectURL(object), 60000);
      } catch {
        notice('Переключаем загрузку на российский сервер...');
        link.href = mirror;
        save(mirror);
      } finally { busy = false; }
    };
  }

  // Only replay lookup requests. Creating a payment never passes through this helper.
  async function lookup(path, options) {
    if (local || !apex || russian === false) return fetch((local ? '' : primary) + path, options);
    try { return await readPrimary(primary + path, options, 1024 * 1024); }
    catch { return fetch(ru + path, { ...options, signal: AbortSignal.timeout(10000) }); }
  }
  window.rzRelease = { bind, lookup };
})();
