/* «Юридическая информация»: реквизиты продавца в исходниках только в Base64 и попадают в DOM лишь по клику.
   Это защита от поисковиков и простых парсеров, а не секрет: человек по кнопке видит всё. */
(function legalInfo() {
  'use strict';
  const DATA = 'eyJsaW5lcyI6W1si0J/RgNC+0LTQsNCy0LXRhiIsItCh0LDQvNC+0LfQsNC90Y/RgtGL0LkgKNC/0LvQsNGC0LXQu9GM0YnQuNC6INC90LDQu9C+0LPQsCDQvdCwINC/0YDQvtGE0LXRgdGB0LjQvtC90LDQu9GM0L3Ri9C5INC00L7RhdC+0LQpINCR0LDRhdC+0L3RjNC60LAg0JXQstCz0LXQvdC40Lkg0JzQuNGF0LDQudC70L7QstC40YciXSxbItCj0J3QnyIsItCV0JIwOTIwNjU0ICjQoNC10YHQv9GD0LHQu9C40LrQsCDQkdC10LvQsNGA0YPRgdGMKSJdXSwiZW1haWwiOiJydXN0b21pemF0b3Iuc3VwcG9ydEBnbWFpbC5jb20iLCJ0ZyI6Imh0dHBzOi8vdC5tZS9ydXN0b21pemF0b3IifQ==';
  const decode = () => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(DATA), (c) => c.charCodeAt(0))));
  const node = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };

  let dlg = null;
  let opener = null;
  const close = () => {
    if (!dlg) return;
    const d = dlg;
    dlg = null;
    d.classList.remove('is-open');
    setTimeout(() => d.remove(), 250);
    document.removeEventListener('keydown', onKey);
    if (opener) opener.focus();
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };

  const open = (btn) => {
    if (dlg) return;
    opener = btn;
    const d = decode();
    dlg = node('div', 'li-back');
    const box = node('div', 'li-box');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Юридическая информация');
    box.append(node('h3', 'li-title', 'Юридическая информация'));
    d.lines.forEach(([k, v]) => { const p = node('p'); p.append(node('b', '', k + ': '), document.createTextNode(v)); box.append(p); });
    const c = node('p');
    const mail = node('a', '', d.email);
    mail.href = 'mailto:' + d.email;
    const tg = node('a', '', d.tg.replace('https://', ''));
    tg.href = d.tg; tg.target = '_blank'; tg.rel = 'noopener';
    c.append(node('b', '', 'Связь с продавцом: '), mail, document.createTextNode(', Telegram '), tg);
    box.append(c);
    const x = node('button', 'li-close', 'Закрыть');
    x.type = 'button';
    x.addEventListener('click', close);
    box.append(x);
    dlg.append(box);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    document.body.append(dlg);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => { dlg.classList.add('is-open'); x.focus(); });
  };

  document.querySelectorAll('[data-legal-info]').forEach((b) => b.addEventListener('click', () => open(b)));
})();
