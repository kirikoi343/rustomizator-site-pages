/* Rustomizator — интерактивные демо функций вместо скриншотов. Без зависимостей.
   Каждое демо собирается в контейнер [data-demo="…"] и работает только в браузере: системы посетителя ничего не касается.
   Цифры — условные демо-данные (подпись «демо» в шапке каждого блока). */
(function demos() {
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const fmt = (n, d = 1) => n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const head = (title, extra = '') => `<div class="dm-head"><b>${title}</b>${extra}<span class="dm-badge">демо</span></div>`;
  const toggle = (on, label = '') => `<button type="button" class="dm-toggle${on ? ' is-on' : ''}" role="switch" aria-checked="${on}" aria-label="${label}"><i></i></button>`;
  const flip = (btn, on) => { btn.classList.toggle('is-on', on); btn.setAttribute('aria-checked', String(on)); };
  // Детерминированный «случайный» ряд: одинаковые графики при каждом заходе.
  const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  // Число плавно «доезжает» до цели.
  const tween = (from, to, ms, on, done) => {
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      on(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    };
    requestAnimationFrame(step);
  };
  const pop = (root, text, tone = 'ok') => {
    const n = h(`<div class="dm-pop is-${tone}">${text}</div>`);
    root.append(n);
    setTimeout(() => n.classList.add('is-out'), 2200);
    setTimeout(() => n.remove(), 2700);
  };

  /* Видео → canvas через WebGL-шейдер цветокоррекции. params() отдаёт s (−1…1), c (−0.75…1), w (−1…1). */
  const gradeVideo = (video, canvas, params) => {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) return null;
    const vs = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x,-p.y)*.5+.5;gl_Position=vec4(p,0.,1.);}';
    const fs = `precision mediump float;
uniform sampler2D t;uniform float S,C,W;varying vec2 v;
vec3 hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;
return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}
vec3 rgb(vec3 c){vec3 p=abs(fract(c.xxx+vec3(1.,2./3.,1./3.))*6.-3.);return c.z*mix(vec3(1.),clamp(p-1.,0.,1.),c.y);}
float band(float h,float c,float w){float d=abs(fract(h-c+.5)-.5);return smoothstep(w,0.,d);}
void main(){
 vec3 c=texture2D(t,v).rgb;
 c*=vec3(1.+W*.16,1.+W*.03,1.-W*.2);
 vec3 h=hsv(clamp(c,0.,1.));
 float up=max(S,0.);
 float sky=band(h.x,.59,.09),grass=band(h.x,.25,.075),gold=band(h.x,.125,.05),skin=band(h.x,.04,.045);
 h.x+=up*(sky*(.61-h.x)*.5+grass*(.3-h.x)*.55+gold*(.1-h.x)*.55);
 float g=up*(1.+sky*1.1+grass*1.3+gold*1.1-skin*.75);
 float s=h.y;
 s+=g*s*(1.-s)*1.7+g*s*.38;
 s*=1.+min(S,0.);
 h.y=clamp(s,0.,1.);
 h.z*=1.-up*sky*h.y*.16;
 h.z*=1.+up*(grass+gold)*.06;
 c=rgb(h);
 float k=max(C,0.);
 c=mix(c,c*c*(3.-2.*c),k*.85);
 c=(c-.5)*(1.+min(C,0.)*.6+k*.12)+.5;
 gl_FragColor=vec4(clamp(c,0.,1.),1.);}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, a); gl.attachShader(prog, b); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const u = { S: gl.getUniformLocation(prog, 'S'), C: gl.getUniformLocation(prog, 'C'), W: gl.getUniformLocation(prog, 'W') };
    const draw = () => {
      if (video.readyState < 2) return;
      if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      const p = params();
      gl.uniform1f(u.S, p.s); gl.uniform1f(u.C, p.c); gl.uniform1f(u.W, p.w);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    // Кадр рисуется, только когда видео выдало новый кадр (или поменяли ползунок) — без постоянного цикла.
    const onFrame = () => { draw(); if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame); };
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
    else video.addEventListener('timeupdate', draw);
    video.addEventListener('loadeddata', draw);
    video.addEventListener('seeked', draw);
    return { draw };
  };

  const builders = {
    /* ---------- Детектор лагов: график FPS + фризы с причинами ---------- */
    lag(root) {
      const N = 140;
      const series = (seed, base, dips) => {
        const r = rng(seed);
        const a = Array.from({ length: N }, (_, i) => base + Math.sin(i / 9) * 9 + (r() - 0.5) * 18);
        dips.forEach(([i, v]) => { a[i] = v; a[i + 1] = (a[i + 1] + v) / 2; });
        return a;
      };
      const games = {
        now: { fps: series(7, 196, [[24, 64], [71, 102], [118, 131]]), freezes: [
          { i: 24, ms: 184, cause: 'Драйвер', who: 'nvlddmkm.sys', note: 'Видеодрайвер дольше обычного обрабатывал прерывания.' },
          { i: 71, ms: 97, cause: 'Диск фоновой программы', who: 'SearchIndexer.exe', note: 'Индексация Windows читала диск в момент фриза.' },
          { i: 118, ms: 66, cause: 'Внутри игры', who: 'RustClient.exe', note: 'Драйверы, диск и память в норме — пауза была в самой игре.' },
        ] },
        prev: { fps: series(3, 168, [[18, 41], [44, 70], [63, 58], [97, 77], [126, 88]]), freezes: [
          { i: 18, ms: 240, cause: 'Нехватка памяти', who: 'RustClient.exe', note: 'Игра читала страницы из файла подкачки.' },
          { i: 44, ms: 151, cause: 'Драйвер', who: 'nvlddmkm.sys', note: 'Видеодрайвер дольше обычного обрабатывал прерывания.' },
          { i: 63, ms: 163, cause: 'Диск фоновой программы', who: 'MsMpEng.exe', note: 'Антивирус сканировал файлы игры.' },
          { i: 97, ms: 120, cause: 'Нехватка памяти', who: 'RustClient.exe', note: 'Игра читала страницы из файла подкачки.' },
          { i: 126, ms: 92, cause: 'Внутри игры', who: 'RustClient.exe', note: 'Пауза была в самой игре.' },
        ] },
      };
      root.innerHTML = head('Детектор лагов', '<span class="dm-seg" role="tablist"><button type="button" data-g="now" class="is-on">Эта игра</button><button type="button" data-g="prev">Прошлая</button></span>') + `
        <div class="lag-stats"><div><small>Средний FPS</small><b data-s="avg">0</b></div><div><small>1% low</small><b data-s="p1">0</b></div><div><small>0,1% low</small><b data-s="p01">0</b></div><div><small>Фризов</small><b data-s="fz">0</b></div></div>
        <div class="lag-chart"><svg viewBox="0 0 560 150" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lagfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00f2fe" stop-opacity=".35"/><stop offset="1" stop-color="#00f2fe" stop-opacity="0"/></linearGradient></defs><path class="lag-area"/><path class="lag-line"/><line class="lag-cross" y1="0" y2="150"/></svg><div class="lag-marks"></div><span class="lag-tip" hidden></span></div>
        <p class="dm-cap">Почему были фризы — нажмите на фриз</p>
        <ul class="lag-causes"></ul>`;
      const svg = q('svg', root), line = q('.lag-line', root), area = q('.lag-area', root), marks = q('.lag-marks', root), list = q('.lag-causes', root);
      const tip = q('.lag-tip', root), cross = q('.lag-cross', root);
      let cur = 'now';
      const xy = (v, i) => [i / (N - 1) * 560, 150 - (v - 20) / 230 * 150];
      const pick = (idx) => {
        qa('.lag-causes li', root).forEach((li, k) => li.classList.toggle('is-open', k === idx));
        qa('.lag-mark', root).forEach((m, k) => m.classList.toggle('is-on', k === idx));
      };
      const draw = () => {
        const g = games[cur];
        const pts = g.fps.map((v, i) => xy(v, i));
        const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
        line.setAttribute('d', d);
        area.setAttribute('d', d + ' L560 150 L0 150 Z');
        const len = line.getTotalLength ? line.getTotalLength() : 2000;
        line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
        requestAnimationFrame(() => { line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)'; line.style.strokeDashoffset = 0; });
        const sorted = [...g.fps].sort((a, b) => a - b);
        const avg = g.fps.reduce((a, b) => a + b, 0) / N;
        const vals = { avg, p1: sorted[Math.ceil(N * 0.01)], p01: sorted[0], fz: g.freezes.length };
        qa('[data-s]', root).forEach((b) => { const to = vals[b.dataset.s]; tween(Number(b.textContent) || 0, to, 900, (v) => { b.textContent = Math.round(v); }); });
        marks.innerHTML = '';
        list.innerHTML = '';
        g.freezes.forEach((f, k) => {
          const m = h(`<button type="button" class="lag-mark" style="left:${(f.i / (N - 1) * 100).toFixed(2)}%" aria-label="Фриз ${f.ms} мс"></button>`);
          m.addEventListener('click', () => pick(k));
          marks.append(m);
          const min = Math.floor(f.i / 4.2), sec = String(Math.floor((f.i * 14.3) % 60)).padStart(2, '0');
          const li = h(`<li><button type="button"><span class="lc-t">${min}:${sec}</span><b>${f.ms} мс</b><span class="lc-c">${f.cause}</span><span class="lc-w">${f.who}</span></button><p>${f.note}</p></li>`);
          q('button', li).addEventListener('click', () => pick(li.classList.contains('is-open') ? -1 : k));
          list.append(li);
        });
        pick(0);
      };
      qa('.dm-seg button', root).forEach((b) => b.addEventListener('click', () => {
        qa('.dm-seg button', root).forEach((x) => x.classList.toggle('is-on', x === b));
        cur = b.dataset.g; line.style.transition = 'none'; draw();
      }));
      const chart = q('.lag-chart', root);
      chart.addEventListener('pointermove', (e) => {
        const r = svg.getBoundingClientRect();
        const k = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        const i = Math.round(k * (N - 1));
        cross.setAttribute('x1', k * 560); cross.setAttribute('x2', k * 560);
        tip.hidden = false; tip.style.left = k * 100 + '%';
        tip.textContent = Math.round(games[cur].fps[i]) + ' FPS';
        chart.classList.add('is-hover');
      });
      chart.addEventListener('pointerleave', () => { tip.hidden = true; chart.classList.remove('is-hover'); });
      return draw;
    },

    /* ---------- Таймер ---------- */
    timer(root) {
      root.innerHTML = head('Удержание таймера', toggle(true, 'Удерживать таймер')) + `
        <div class="tm-row"><div><small>Выдано системой</small><b class="tm-val">0,500</b><span>мс</span></div><span class="dm-chip is-ok tm-state">Удерживается</span></div>
        <div class="tm-bar"><i></i></div>
        <label class="dm-range"><span>Целевое разрешение <b class="tm-target">0,50 мс</b></span><input type="range" min="0.5" max="2" step="0.05" value="0.5"></label>`;
      const val = q('.tm-val', root), state = q('.tm-state', root), bar = q('.tm-bar i', root), range = q('input', root), sw = q('.dm-toggle', root);
      let on = true, shown = 0.5;
      const go = () => {
        const to = on ? Number(range.value) : 15.625;
        tween(shown, to, on ? 900 : 600, (v) => { shown = v; val.textContent = fmt(v, 3); bar.style.width = Math.max(3, (1 - (v - 0.5) / 15.125) * 100) + '%'; });
        state.textContent = on ? 'Удерживается' : 'Не удерживается';
        state.className = 'dm-chip tm-state ' + (on ? 'is-ok' : 'is-bad');
        root.classList.toggle('is-off', !on);
      };
      range.addEventListener('input', () => { q('.tm-target', root).textContent = fmt(Number(range.value), 2) + ' мс'; if (on) go(); });
      sw.addEventListener('click', () => { on = !on; flip(sw, on); go(); });
      return () => { shown = 15.625; go(); };
    },

    /* ---------- Очистка памяти ---------- */
    ram(root) {
      root.innerHTML = head('Очистка памяти') + `
        <div class="rm-top"><div><small>Свободно</small><b class="rm-free">12,4</b><span>ГБ из 32</span></div><button type="button" class="dm-btn">Очистить сейчас</button></div>
        <div class="rm-bar"><i></i></div>
        <ul class="dm-list">
          <li><span>Умная автоочистка в игре</span>${toggle(true, 'Умная автоочистка')}</li>
          <li><span>Видеопамять перед запуском Rust</span>${toggle(false, 'Очистка видеопамяти')}</li>
          <li><span>Службы на время игры</span>${toggle(true, 'Службы на время игры')}</li>
        </ul>`;
      const free = q('.rm-free', root), bar = q('.rm-bar i', root), btn = q('.dm-btn', root);
      let gb = 12.4;
      const paint = () => { free.textContent = fmt(gb); bar.style.width = (gb / 32 * 100) + '%'; };
      paint();
      qa('.dm-toggle', root).forEach((t) => t.addEventListener('click', () => flip(t, !t.classList.contains('is-on'))));
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        btn.disabled = true; btn.classList.add('is-busy'); btn.textContent = 'Очищаем…';
        root.classList.add('is-working');
        await sleep(900);
        const got = gb > 26 ? 0.3 : 1.6 + Math.random() * 2.4;
        tween(gb, Math.min(30.5, gb + got), 1100, (v) => { gb = v; paint(); });
        await sleep(1100);
        root.classList.remove('is-working');
        pop(root, got < 0.5 ? 'Память уже чистая' : `Освобождено ${fmt(got)} ГБ`, got < 0.5 ? 'info' : 'ok');
        btn.disabled = false; btn.classList.remove('is-busy'); btn.textContent = 'Очистить сейчас';
        setTimeout(() => tween(gb, 12.4 + Math.random() * 2, 4000, (v) => { gb = v; paint(); }), 6000); // «программы снова забирают память»
      });
    },

    /* ---------- Графика Rust ---------- */
    graphics(root) {
      const P = {
        esports: { name: 'Максимальный FPS', load: 0.25, v: ['1/4', 'Выкл', 'FXAA', 'Низкая', 'Выкл', 'Вкл'] },
        low: { name: 'Низкие', load: 0.45, v: ['1/2', 'Низкие', 'FXAA', 'Средняя', 'Частично', 'Вкл'] },
        balanced: { name: 'Средние', load: 0.7, v: ['Полные', 'Средние', 'SMAA', 'Высокая', 'Да', 'Выкл'] },
        max: { name: 'Максимальные', load: 1, v: ['Полные', 'Ультра', 'TAA', 'Максимум', 'Всё', 'Выкл'] },
      };
      const rows = ['Текстуры', 'Тени', 'Сглаживание', 'Детализация', 'Постобработка', 'Кэш теней'];
      root.innerHTML = head('Rust Graphics Studio') + `
        <div class="gr-presets">${Object.entries(P).map(([k, p]) => `<button type="button" data-p="${k}">${p.name}</button>`).join('')}</div>
        <div class="gr-load"><span>Нагрузка на ПК</span><i><em></em></i></div>
        <dl class="gr-table">${rows.map((r) => `<div><dt>${r}</dt><dd>—</dd></div>`).join('')}</dl>
        <p class="dm-cap gr-note">Текстуры подбираются по объёму видеопамяти вашего ПК.</p>`;
      const set = (k) => {
        qa('.gr-presets button', root).forEach((b) => b.classList.toggle('is-on', b.dataset.p === k));
        q('.gr-load em', root).style.width = P[k].load * 100 + '%';
        q('.gr-load em', root).style.background = P[k].load > 0.8 ? 'linear-gradient(90deg,#ffb547,#ff5c7a)' : 'linear-gradient(90deg,#00ff87,#00f2fe)';
        qa('.gr-table dd', root).forEach((dd, i) => {
          const nv = P[k].v[i];
          if (dd.textContent === nv) return;
          dd.classList.remove('is-flash'); void dd.offsetWidth;
          dd.textContent = nv; dd.classList.add('is-flash');
        });
      };
      qa('.gr-presets button', root).forEach((b) => b.addEventListener('click', () => set(b.dataset.p)));
      set('esports');
    },

    /* ---------- Игровой режим ---------- */
    gamemode(root) {
      const procs = [['chrome.exe', 'браузер'], ['Telegram.exe', 'мессенджер'], ['OneDrive.exe', 'синхронизация'], ['EpicGamesLauncher.exe', 'лаунчер'], ['Discord.exe', 'не трогаем'], ['steam.exe', 'не трогаем']];
      root.innerHTML = head('Игровой режим на время игры', toggle(true, 'Игровой режим')) + `
        <div class="gm-row"><span class="dm-chip gm-state">Rust не запущен</span><button type="button" class="dm-btn dm-btn-ghost gm-run">▶ Запустить Rust</button></div>
        <ul class="gm-procs">${procs.map(([p, d]) => `<li data-safe="${d === 'не трогаем'}"><span>${p}</span><small>${d}</small><em>—</em></li>`).join('')}</ul>`;
      const sw = q('.dm-toggle', root), run = q('.gm-run', root), st = q('.gm-state', root);
      let on = true, playing = false, timers = [];
      const clear = () => { timers.forEach(clearTimeout); timers = []; };
      const paint = () => {
        clear();
        st.textContent = playing ? 'Rust запущен' : 'Rust не запущен';
        st.className = 'dm-chip gm-state' + (playing ? ' is-ok' : '');
        run.textContent = playing ? '■ Выйти из игры' : '▶ Запустить Rust';
        qa('.gm-procs li', root).forEach((li, i) => {
          const em = q('em', li);
          const safe = li.dataset.safe === 'true';
          const target = !playing || !on ? '—' : safe ? 'исключение' : 'EcoQoS · диск ↓';
          timers.push(setTimeout(() => { em.textContent = target; li.classList.toggle('is-eco', target.startsWith('Eco')); li.classList.toggle('is-skip', target === 'исключение'); }, playing && on ? 180 * i : 0));
        });
      };
      sw.addEventListener('click', () => { on = !on; flip(sw, on); paint(); });
      run.addEventListener('click', () => { playing = !playing; paint(); });
      paint();
    },

    /* ---------- Раскладка ядер ---------- */
    affinity(root) {
      const presets = {
        rec: { name: 'Рекомендовано', hint: 'Rust — на всех ядрах, фон — на Core 0 с низким приоритетом.', map: (c, t) => (c === 0 ? 'bg' : 'game') },
        nosmt: { name: 'Без SMT', hint: 'По одному потоку на ядро для Rust, Core 0 — фону, вторые потоки свободны.', map: (c, t) => (c === 0 ? 'bg' : t === 0 ? 'game' : 'idle') },
        stock: { name: 'Сток', hint: 'Всё как у Windows: никаких закреплений.', map: () => 'stock' },
      };
      root.innerHTML = head('Раскладка ядер для Rust') + `
        <div class="af-presets">${Object.entries(presets).map(([k, p]) => `<button type="button" data-p="${k}">${p.name}</button>`).join('')}</div>
        <p class="dm-cap af-hint"></p>
        <div class="af-cores">${Array.from({ length: 8 }, (_, c) => `<span class="af-core"><i data-c="${c}" data-t="0">${c * 2}</i><i data-c="${c}" data-t="1">${c * 2 + 1}</i></span>`).join('')}</div>
        <div class="af-legend"><span class="lg-game">Rust</span><span class="lg-bg">Фон</span><span class="lg-idle">Свободно</span></div>
        <div class="af-foot"><button type="button" class="dm-btn">Применить</button><span class="af-res"></span></div>`;
      let cur = 'rec';
      const set = (k) => {
        cur = k;
        qa('.af-presets button', root).forEach((b) => b.classList.toggle('is-on', b.dataset.p === k));
        q('.af-hint', root).textContent = presets[k].hint;
        qa('.af-cores i', root).forEach((i, n) => {
          setTimeout(() => { i.className = 'is-' + presets[k].map(Number(i.dataset.c), Number(i.dataset.t)); }, n * 22);
        });
        q('.af-res', root).textContent = '';
      };
      qa('.af-presets button', root).forEach((b) => b.addEventListener('click', () => set(b.dataset.p)));
      q('.af-foot .dm-btn', root).addEventListener('click', async (e) => {
        const b = e.currentTarget; b.disabled = true; b.textContent = 'Применяем…';
        await sleep(800);
        b.disabled = false; b.textContent = 'Применить';
        q('.af-res', root).textContent = cur === 'stock' ? '✓ Возвращено как было' : '✓ Применено, параметры Steam записаны';
        pop(root, cur === 'stock' ? 'Раскладка снята' : 'Раскладка применена');
      });
      set('rec');
    },

    /* ---------- Серверы ---------- */
    servers(root) {
      const list = [['Rustoria.co — US Main', 412, 450, 23], ['Rusticated.com — EU Main', 287, 300, 4], ['Rustafied.com — EU Medium', 198, 250, 0], ['Rusty Moose |EU Monthly|', 340, 400, 11], ['Vital Rust — EU 2x', 156, 200, 0]];
      root.innerHTML = head('Серверы и вайпы') + `<ul class="sv-list">${list.map(([n, on, max, qn], i) => `
        <li data-i="${i}"><div class="sv-name"><b>${n}</b><small>онлайн ${on}/${max} · очередь <span class="sv-q">${qn}</span></small></div>
        <span class="sv-ping">— мс</span><button type="button" class="dm-btn dm-btn-ghost sv-pbtn">Пинг</button>
        <button type="button" class="dm-btn sv-join">${qn ? 'Ждать очередь' : 'Зайти'}</button></li>`).join('')}</ul>`;
      qa('.sv-list li', root).forEach((li) => {
        const i = Number(li.dataset.i);
        let qn = list[i][3], timer = 0;
        q('.sv-pbtn', li).addEventListener('click', async (e) => {
          const b = e.currentTarget, p = q('.sv-ping', li);
          b.disabled = true; p.textContent = '…'; p.className = 'sv-ping is-busy';
          await sleep(500 + Math.random() * 500);
          const ms = Math.round((i % 2 ? 38 : 52) + Math.random() * 30);
          p.textContent = ms + ' мс'; p.className = 'sv-ping ' + (ms < 60 ? 'is-ok' : 'is-mid');
          b.disabled = false;
        });
        const join = q('.sv-join', li);
        join.addEventListener('click', () => {
          if (timer) { clearInterval(timer); timer = 0; join.textContent = 'Ждать очередь'; li.classList.remove('is-wait'); return; }
          if (qn === 0) { join.textContent = 'Заходим…'; pop(root, 'Steam запускает Rust с подключением'); setTimeout(() => { join.textContent = 'Зайти'; }, 2200); return; }
          li.classList.add('is-wait'); join.textContent = 'Отменить';
          timer = setInterval(() => {
            qn = Math.max(0, qn - 1 - Math.floor(Math.random() * 3));
            q('.sv-q', li).textContent = qn;
            if (qn === 0) { clearInterval(timer); timer = 0; li.classList.remove('is-wait'); join.textContent = 'Зайти'; pop(root, 'Очередь подошла — заходим'); qn = list[i][3]; setTimeout(() => { q('.sv-q', li).textContent = qn; }, 4000); }
          }, 700);
        });
      });
    },

    /* ---------- Фон на время игры ---------- */
    gamebg(root) {
      const items = [['Поиск Windows', 'WSearch'], ['SysMain (предзагрузка)', 'SysMain'], ['Телеметрия Windows', 'DiagTrack'], ['Центр обновления', 'wuauserv'], ['Оптимизация доставки', 'DoSvc'], ['Апдейтер Edge', 'edgeupdate'], ['Телеметрия NVIDIA', 'NvTelemetry'], ['Оверлей NVIDIA', 'NVIDIA Overlay']];
      root.innerHTML = head('Службы на время игры', toggle(false, 'Службы на время игры')) + `
        <p class="dm-cap gb-cap">Выключено — службы работают как обычно.</p>
        <ul class="gb-list">${items.map(([n, id]) => `<li><span><b>${n}</b><small>${id}</small></span><em>работает</em></li>`).join('')}</ul>`;
      const sw = q('.dm-toggle', root);
      let on = false, ts = [];
      sw.addEventListener('click', () => {
        on = !on; flip(sw, on);
        ts.forEach(clearTimeout); ts = [];
        q('.gb-cap', root).textContent = on ? 'Rust запущен — останавливаем только то, что работало.' : 'Игра закрыта — всё запущено обратно.';
        qa('.gb-list li', root).forEach((li, i) => ts.push(setTimeout(() => {
          li.classList.toggle('is-off', on);
          q('em', li).textContent = on ? 'на паузе' : 'работает';
        }, i * 140)));
        if (on) ts.push(setTimeout(() => pop(root, `Остановлено ${items.length} фоновых задач`), items.length * 140 + 100));
      });
    },

    /* ---------- Фильтры экрана ---------- */
    filters(root) {
      const presets = { none: ['Без фильтра', 100, 100, 0, 0], vivid: ['Насыщенный', 165, 115, 0, 0], winter: ['Зима', 130, 112, -60, 0], autumn: ['Осень', 150, 112, 55, 0], mc: ['Майнкрафт', 200, 125, 8, 0] };
      root.innerHTML = head('Фильтры экрана') + `
        <div class="fl-view"><video src="assets/demo/filters.mp4" poster="assets/demo/filters.jpg" muted loop playsinline preload="auto" crossorigin="anonymous" aria-hidden="true"></video>
          <canvas aria-hidden="true"></canvas><span class="fl-hint">Зажмите — без фильтра</span></div>
        <div class="fl-presets">${Object.entries(presets).map(([k, p]) => `<button type="button" data-p="${k}">${p[0]}</button>`).join('')}</div>
        <label class="dm-range"><span>Насыщенность <b data-o="s">100</b></span><input type="range" data-k="s" min="0" max="200" value="100"></label>
        <label class="dm-range"><span>Контраст <b data-o="c">100</b></span><input type="range" data-k="c" min="70" max="140" value="100"></label>
        <label class="dm-range"><span>Теплота <b data-o="w">0</b></span><input type="range" data-k="w" min="-100" max="100" value="0"></label>`;
      const box = q('.fl-view', root);
      const video = q('video', box);
      const v = { s: 100, c: 100, w: 0 };
      let raw = false;
      // Цветокоррекция по оттенкам (HSL), как в редакторе: небо глубже и синее, трава зеленее, золото и краски скина
      // сочнее, кожа рук не краснеет, белые облака и серые камни почти не меняются. Шкала намеренно круче настоящей,
      // чтобы разница была видна в маленьком окне. Нет WebGL — запасной CSS-фильтр.
      const grade = gradeVideo(video, q('canvas', box), () => raw ? { s: 0, c: 0, w: 0 } : { s: (v.s - 100) / 100, c: (v.c - 100) / 40, w: v.w / 100 });
      box.classList.toggle('is-gl', !!grade);
      new IntersectionObserver(([e]) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); }).observe(box);
      const hold = (on) => { raw = on; box.classList.toggle('is-raw', on); apply(); };
      box.addEventListener('pointerdown', () => hold(true));
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => box.addEventListener(ev, () => raw && hold(false)));
      const apply = () => {
        if (grade) grade.draw();
        else {
          const k = raw ? 0 : 1;
          video.style.filter = `saturate(${(1 + (v.s - 100) / 100 * 1.6 * k).toFixed(2)}) contrast(${(1 + (v.c - 100) / 100 * 1.5 * k).toFixed(2)})`;
        }
        qa('[data-o]', root).forEach((b) => { b.textContent = v[b.dataset.o]; });
        qa('input[data-k]', root).forEach((i) => { i.value = v[i.dataset.k]; });
      };
      qa('input[data-k]', root).forEach((i) => i.addEventListener('input', () => { v[i.dataset.k] = Number(i.value); qa('.fl-presets button', root).forEach((b) => b.classList.remove('is-on')); apply(); }));
      qa('.fl-presets button', root).forEach((b) => b.addEventListener('click', () => {
        const p = presets[b.dataset.p];
        qa('.fl-presets button', root).forEach((x) => x.classList.toggle('is-on', x === b));
        const from = { ...v };
        tween(0, 1, 500, (k) => { v.s = Math.round(from.s + (p[1] - from.s) * k); v.c = Math.round(from.c + (p[2] - from.c) * k); v.w = Math.round(from.w + (p[3] - from.w) * k); apply(); });
      }));
      q('.fl-presets button[data-p="vivid"]', root).click();
    },

    /* ---------- Кэш и логи ---------- */
    clean(root) {
      const items = [['Шейдерный кэш NVIDIA', 1.42], ['Шейдерный кэш DirectX', 0.61], ['Скины мастерской и карты', 3.87], ['Логи и дампы Rust', 0.28], ['Временные файлы Windows', 2.15]];
      root.innerHTML = head('Кэш и логи') + `
        <ul class="cl-list">${items.map(([n, gb], i) => `<li><label><input type="checkbox" ${i !== 2 ? 'checked' : ''}><span>${n}</span></label><b data-gb="${gb}">${fmt(gb, 2)} ГБ</b></li>`).join('')}</ul>
        <div class="cl-foot"><span>Выбрано: <b class="cl-sum">0</b> ГБ</span><button type="button" class="dm-btn">Очистить</button></div>
        <p class="dm-cap">Файлы самой игры не удаляются никогда.</p>`;
      const sum = () => qa('.cl-list li', root).filter((li) => q('input', li).checked).reduce((a, li) => a + Number(q('b', li).dataset.gb), 0);
      const paint = () => { q('.cl-sum', root).textContent = fmt(sum(), 2); };
      qa('input', root).forEach((i) => i.addEventListener('change', paint));
      paint();
      q('.cl-foot .dm-btn', root).addEventListener('click', async (e) => {
        const b = e.currentTarget, total = sum();
        if (!total) { pop(root, 'Отметьте, что очистить', 'info'); return; }
        b.disabled = true;
        const rows = qa('.cl-list li', root).filter((li) => q('input', li).checked);
        for (const li of rows) {
          const cell = q('b', li), gb = Number(cell.dataset.gb);
          li.classList.add('is-busy');
          await new Promise((r) => tween(gb, 0, 600, (x) => { cell.textContent = fmt(x, 2) + ' ГБ'; }, r));
          li.classList.remove('is-busy'); li.classList.add('is-done');
        }
        pop(root, `Освобождено ${fmt(total, 2)} ГБ`);
        q('.cl-sum', root).textContent = '0,00';
        await sleep(3500);
        rows.forEach((li) => { li.classList.remove('is-done'); q('b', li).textContent = fmt(Number(q('b', li).dataset.gb), 2) + ' ГБ'; });
        paint(); b.disabled = false;
      });
    },
  };

  // Сборка: сразу, а «оживление» (анимация графика, таймера) — когда блок впервые попал в экран.
  const start = [];
  qa('[data-demo]').forEach((root) => {
    const make = builders[root.dataset.demo];
    if (!make) return;
    try {
      const onShow = make(root);
      if (typeof onShow === 'function') start.push([root, onShow]);
    } catch (e) { console.error('demo', root.dataset.demo, e); }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const hit = start.find(([r]) => r === e.target);
      if (hit) hit[1]();
    }), { threshold: 0.25 });
    start.forEach(([r]) => io.observe(r));
  } else start.forEach(([, f]) => f());
})();
