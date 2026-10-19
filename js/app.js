/* ============================================================
   APP.JS — общие утилиты для всех страниц
   ============================================================ */

/* ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ===== */
(function () {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;

  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

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
    const isDark = (t === 'dark');
    btn.innerHTML = isDark ? SUN : MOON;
    btn.title = isDark ? 'Светлая тема' : 'Тёмная тема';
    btn.setAttribute('aria-label', btn.title);
  }

  btn.addEventListener('click', () => {
    const next = getPref() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme-pref', next); } catch (e) {}
    update();
  });

  update();
})();

/* ===== ДЫХАНИЕ 4–4–6 ===== */
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
    const inPages = location.pathname.indexOf('/pages/') !== -1;
    const swPath = inPages ? '../sw.js' : 'sw.js';
    navigator.serviceWorker.register(swPath).catch(() => {});
  });
}

/* ============================================================
   ЗАПОЛНЕНИЕ ПУСТЫХ МЕСТ В СЕТКЕ (ghost cards)
   ============================================================ */
function fillEmptyGridCells() {
  const grids = document.querySelectorAll('.cards-grid');
  
  let columns = 1;
  const width = window.innerWidth;
  if (width >= 1100) columns = 3;
  else if (width >= 701) columns = 2;
  
  grids.forEach(grid => {
    grid.querySelectorAll('.card-ghost').forEach(el => el.remove());

    const cards = Array.from(grid.querySelectorAll('.card'));
    if (cards.length === 0) return;

    const remainder = cards.length % columns;
    const missing = remainder === 0 ? 0 : columns - remainder;

    for (let i = 0; i < missing; i++) {
      const ghost = document.createElement('div');
      ghost.className = 'card-ghost';
      grid.appendChild(ghost);
    }
  });
}

/* ============================================================
   ЗАПОЛНЕНИЕ ПРИЗРАЧНЫМИ ПЛИТКАМИ МИНИ-ПУЛЬТОВ
   ============================================================ */
function fillMiniPultGhosts() {
  const pults = document.querySelectorAll('.mini-pult');
  const width = window.innerWidth;

  pults.forEach(pult => {
    // 1. Удаляем старые заглушки, если они были
    pult.querySelectorAll('.mini-tile.ghost').forEach(el => el.remove());
    
    // 2. Считаем реальные плитки
    const realTiles = pult.querySelectorAll('.mini-tile:not(.ghost)').length;
    if (realTiles === 0) return;

    // 3. Определяем кол-во колонок (та же логика, что и в updateGridLogic)
    let cols = 3;
    if (width <= 500) {
      cols = 2;
    } else if (pult.classList.contains('mini-pult') && realTiles === 2) {
      cols = 2;
    }

    // 4. Задаем цель: если 2 колонки — добиваем до 8, если 3 — до 9
    const target = cols === 2 ? 8 : 9;
    const missing = target - realTiles;

    // 5. Добавляем невидимые заглушки
    for (let i = 0; i < missing; i++) {
      const ghost = document.createElement('div');
      ghost.className = 'mini-tile ghost';
      pult.appendChild(ghost);
    }
  });
}

/* ============================================================
   ЕДИНАЯ ЛОГИКА СЕТКИ ДЛЯ ВСЕХ СТРАНИЦ (мини-пульты)
   ============================================================ */
function updateGridLogic() {
  const grids = document.querySelectorAll('.mini-pult, .dashboard');
  
  grids.forEach(grid => {
    const tiles = Array.from(grid.children).filter(el => 
      !el.classList.contains('wide') && 
      !el.classList.contains('card-ghost')
    );
    const count = tiles.length;
    if (count === 0) return;

    const width = window.innerWidth;
    let cols = 3;

    if (width <= 500) {
      cols = 2;
    } else if (grid.classList.contains('mini-pult') && count === 2) {
      cols = 2;
    }

    const rows = Math.ceil(count / cols);

    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', rows);
  });
}

// Глобальный таймер для ресайза, чтобы не было дубля переменных
let globalResizeTimer;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Заполняем пустые места в карточках
  setTimeout(fillEmptyGridCells, 50);
  
  // 2. Если это не главная (там сетку строит dashboard.js), 
  // то обновляем сетку плиток тут
  if (!document.getElementById('dashboard')) {
    updateGridLogic();
  }
});

// Пересчитываем при изменении размера экрана
window.addEventListener('resize', () => {
  clearTimeout(globalResizeTimer);
  globalResizeTimer = setTimeout(() => {
    fillEmptyGridCells();
    updateGridLogic();
  }, 150);
});

// Показываем версию кэша (SW) в консоли для отладки
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    fetch('../sw.js')
      .then(res => res.text())
      .then(text => {
        const match = text.match(/const CACHE = '(.*?)'/);
        if (match && match[1]) {
          console.log('%c SW Cache Version: ' + match[1], 'background: #222; color: #bada55; font-size: 12px; padding: 4px; border-radius: 4px;');
        }
      }).catch(() => {});
  }
});
