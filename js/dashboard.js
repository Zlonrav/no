/* ============================================================
   DASHBOARD.JS — рендер плашек на главной странице
   ============================================================ */

(function () {
  const grid = document.getElementById('dashboard');
  if (!grid) return;

  const TILES = [
    {
      id: 'addiction',
      label: 'Зависимость',
      href: 'pages/addiction.html',
      color: 'addiction',
      icon: '<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/></svg>'
    },
    {
      id: 'stress',
      label: 'Стресс',
      href: 'pages/stress.html',
      color: 'stress',
      icon: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h8l-1 8 10-12h-8z"/></svg>'
    },
    {
      id: 'prokrutka',
      label: 'Прокрутка',
      href: 'pages/rumination.html',
      color: 'prokrutka',
      icon: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 3v6h-6"/></svg>'
    },
    {
      id: 'understand',
      label: 'Понять',
      href: 'pages/understand.html',
      color: 'understand',
      icon: '<svg viewBox="0 0 24 24"><path d="M2 4h8a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-8a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h9z"/></svg>'
    },
    {
      id: 'breath',
      label: 'Дыхание',
      href: 'pages/breath.html',
      color: 'breath',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10" opacity="0.35"/></svg>'
    },
    {
      id: 'abyss',
      label: 'Бездна',
      href: 'pages/abyss.html',
      color: 'abyss',
      icon: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 7 7 0 0 1-7 7 5 5 0 0 1-5-5 3 3 0 0 1 3-3 1.5 1.5 0 0 1 1.5 1.5"/></svg>'
    },
    {
      id: 'counter',
      label: 'Трезвость',
      href: 'pages/counter.html',
      color: 'counter',
      wide: true,
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>'
    }
  ];

  /* ===== СЧИТАЕМ КОЛОНКИ ===== */
  const normalCount = TILES.filter(t => !t.wide).length;

  function pickColumns() {
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    if (isMobile) return 2;
    return Math.min(Math.ceil(normalCount / 2), 4);
  }

  function applyGrid() {
    const cols = pickColumns();
    const rows = Math.ceil(normalCount / cols);
    document.documentElement.style.setProperty('--cols', cols);
    document.documentElement.style.setProperty('--rows', rows);
  }

  applyGrid();
  window.addEventListener('resize', applyGrid);

  /* ===== РЕНДЕР ПЛИТОК ===== */
  TILES.forEach((tile) => {
    const isButton = tile.action === 'breath';
    const el = document.createElement(isButton ? 'button' : 'a');
    el.className = 'tile tile-' + tile.color + (tile.wide ? ' wide' : '');
    if (!isButton) el.href = tile.href;
    if (isButton) el.type = 'button';

    if (tile.id === 'counter' && window.Sober) {
      const start = window.Sober.getStart();
      if (start) {
        const n = window.Sober.daysSince(start);
        const word = window.Sober.plural(n, ['день', 'дня', 'дней']);
        if (tile.wide) {
          el.innerHTML =
            tile.icon +
            '<div class="wide-text">' +
              '<span class="tile-value">' + n + '</span>' +
              '<span class="tile-label">' + word + '</span>' +
            '</div>';
        } else {
          el.innerHTML =
            tile.icon +
            '<span class="tile-value">' + n + '</span>' +
            '<span class="tile-label">' + word + '</span>';
        }
      } else {
        el.innerHTML = tile.icon + '<span class="tile-label">' + tile.label + '</span>';
      }
    } else {
      el.innerHTML = tile.icon + '<span class="tile-label">' + tile.label + '</span>';
    }

    if (isButton) {
      el.addEventListener('click', () => {
        const btn = document.getElementById('breath-btn');
        if (btn) btn.click();
      });
    }

    grid.appendChild(el);
  });
})();
