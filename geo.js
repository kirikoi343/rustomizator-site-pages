// Render and direct GitHub Pages serve static HTML. The proxied apex handles this at the edge.
(() => {
  const render = location.hostname === 'rustomizator.onrender.com';
  if ((!render && location.hostname !== 'rustomizator.com') ||
      new URLSearchParams(location.search).get('no_redirect') === '1') return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);
  // On Render, its Cloudflare edge already knows the visitor's country.
  const source = render ? '/cdn-cgi/trace' : 'https://ru.rustomizator.com/region';
  fetch(source, {
    credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal: controller.signal,
  }).then(r => r.ok ? r.text() : '').catch(() => '').then(region => {
    clearTimeout(timeout);
    const url = new URL(location.href);
    const russian = render ? /^loc=RU\s*$/m.test(region) : region.trim() === 'ru';
    url.hostname = russian ? 'ru.rustomizator.com' : 'rustomizator.com';
    if (url.hostname !== location.hostname) location.replace(url.href);
  });
})();
