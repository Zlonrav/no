/* ============================================================
   APP.JS — общие утилиты для всех страниц
   Подключается внизу <body> через <script src="..." defer></script>
   ============================================================ */

/* ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (только там, где есть кнопка) ===== */
(function () {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;

  function getPref() {
    try { return localStorage.getItem('theme-pref') === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }

  function apply(t) {
    document.documentElement.dataset.theme = t;
  }

  function update() {
    const t = getPref();
    apply(t);
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    btn.title = t === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    btn.setAttribute('aria-label', btn.title);
  }

  btn.addEventListener('click', () => {
    const next = getPref() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme-pref', next); } catch (e) {}
    update();
  });

  update();
})();

/* ===== ДЫХАНИЕ 4–4–6 (только там, где есть оверлей) ===== */
(function () {
  const overlay = document.getElementById('breath-overlay');
  if (!overlay) return;

  const circle = document.getElementById('breath-circle');
  const label = document.getElementById('breath-label');
  const counter = document.getElementById('breath-counter');
  const openBtn = document.getElementById('breath-btn');
  const closeBtn = document.getElementById('breath-close');

  let labelTimer = null;
  let cycle = 0;
  let running = false;

  const INHALE = 4000;
  const HOLD = 4000;
  const EXHALE = 6000;
  const TOTAL = INHALE + HOLD + EXHALE;

  function runLabelCycle() {
    label.textContent = 'Вдох';
    labelTimer = setTimeout(() => {
      label.textContent = 'Держи';
      labelTimer = setTimeout(() => {
        label.textContent = 'Выдох';
        labelTimer = setTimeout(() => {
          cycle++;
          counter.textContent = 'Цикл ' + cycle;
          runLabelCycle();
        }, EXHALE);
      }, HOLD);
    }, INHALE);
  }

  function start() {
    if (running) return;
    running = true;
    cycle = 0;
    counter.textContent = 'Цикл 1';
    overlay.hidden = false;
    circle.style.animation = 'none';
    void circle.offsetWidth;
    circle.style.animation = `breath ${TOTAL}ms ease-in-out infinite`;
    runLabelCycle();
    document.body.style.overflow = 'hidden';
  }

  function stop() {
    running = false;
    clearTimeout(labelTimer);
    labelTimer = null;
    overlay.hidden = true;
    circle.style.animation = 'none';
    document.body.style.overflow = '';
    label.textContent = 'Вдох';
    counter.textContent = 'Цикл 1';
  }

  if (openBtn) openBtn.addEventListener('click', start);
  if (closeBtn) closeBtn.addEventListener('click', stop);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) stop();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && running) stop();
  });
})();

/* ===== PWA: регистрация Service Worker ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
