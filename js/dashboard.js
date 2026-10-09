/* ============================================================
   DASHBOARD.JS — рендер страниц и плиток пульта
   ============================================================ */

(function () {
  const pult = document.getElementById('pult');
  const pager = document.getElementById('pager');
  const pagerUp = document.getElementById('pager-up');
  const pagerDown = document.getElementById('pager-down');
  if (!pult) return;

  /* ===== ПОРЯДОК ПЛИТОК ===== */
  const TILES = [
    { id: 'alcohol',    label: 'Алкоголь',  href: 'pages/alcohol.html',    color: 'alcohol',
      icon: '<svg viewBox="0 0 24 24"><path d="M6 3h12l-1 8a5 5 0 0 1-10 0z"/><path d="M12 11v9"/><path d="M8 20h8"/></svg>' },
    { id: 'vape',       label: 'Вэйп',      href: 'pages/vape.html',       color: 'vape',
      icon: '<svg viewBox="0 0 24 24"><path d="M7 12c-1.7 0-3-1.3-3-3s1.3-3 3-3c0.5-2 2.5-3.5 4.5-3.5S16 4 16 6c1.7 0 3 1.3 3 3s-1.3 3-3 3"/><rect x="8" y="14" width="8" height="7" rx="1.5"/></svg>' },
    { id: 'trgz',       label: 'ТРГЗ',      href: 'pages/trgz.html',       color: 'trgz',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/><path d="M12 8v5"/><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none"/></svg>' },
    { id: 'prokrutka',  label: 'Прокрутка', href: 'pages/rumination.html', color: 'prokrutka',
      icon: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 3v6h-6"/></svg>' },
    { id: 'understand', label: 'Понять',    href: 'pages/understand.html', color: 'understand',
      icon: '<svg viewBox="0 0 24 24"><path d="M2 4h8a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-8a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h9z"/></svg>' },
    { id: 'stress',     label: 'Стресс',    href: 'pages/stress.html',     color: 'stress',
      icon: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h8l-1 8 10-12h-8z"/></svg>' },
    { id: 'counter',    label: 'Трезвость', href: 'pages/counter.html',    color: 'counter', wide: true,
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>' },
    { id: 'abyss',      label: 'Бездна',    href: 'pages/abyss.html',      color: 'abyss',
      icon: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 7 7 0 0 1-7 7 5 5 0 0 1-5-5 3 3 0 0 1 3-3 1.5 1.5 0 0 1 1.5 1.5"/></svg>' },
    { id: 'breath',     label: 'Дыхание',   action: 'breath',              color: 'breath',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10" opacity="0.35"/></svg>' }
  ];

  const SLOTS_PER_PAGE = 8;

  /* ===== РАСПРЕДЕЛЕНИЕ ПО СТРАНИЦАМ ===== */
  const pages = [];
  let current = [];
  let currentSlots = 0;

  TILES.forEach(tile => {
    const slots = tile.wide ? 2 : 1;
    if (currentSlots + slots > SLOTS_PER_PAGE) {
      pages.push(current);
      current = [];
      currentSlots = 0;
    }
    current.push(tile);
    currentSlots += slots;
  });
  if (current.length) pages.push(current);

  /* ===== ХЕЛПЕР: РЕНДЕР ОДНОЙ ПЛИТКИ ===== */
  function buildTile(tile, isWide) {
    const isButton = tile.action === 'breath';
    const el = document.createElement(isButton ? 'button' : 'a');
    el.className = 'tile tile-' + tile.color + (isWide ? ' wide' : '');
    if (!isButton) el.href = tile.href;
    if (isButton) el.type = 'button';

    if (tile.id === 'counter' && window.Sober) {
      const start = window.Sober.getStart();
      if (start) {
        const n = window.Sober.daysSince(start);
        const word = window.Sober.plural(n, ['день', 'дня', 'дней']);
        if (isWide) {
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
        return el;
      }
    }

    el.innerHTML = tile.icon + '<span class="tile-label">' + tile.label + '</span>';

    if (isButton) {
      el.addEventListener('click', () => {
        const btn = document.getElementById('breath-btn');
        if (btn) btn.click();
      });
    }
    return el;
  }

  /* ===== РЕНДЕР ВСЕХ СТРАНИЦ ===== */
  pages.forEach((pageTiles, pageIdx) => {
    const pageEl = document.createElement('div');
    pageEl.className = 'page';
    pageEl.dataset.index = pageIdx;
    pageEl.style.transform = 'translateY(' + (pageIdx * 100) + '%)';

    const grid = document.createElement('div');
    grid.className = 'dashboard';

    pageTiles.forEach(tile => {
      grid.appendChild(buildTile(tile, !!tile.wide));
    });

    pageEl.appendChild(grid);
    pult.appendChild(pageEl);
  });

  /* ===== НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ ===== */
  let currentPage = 0;
  const totalPages = pages.length;

  if (totalPages > 1) {
    pager.hidden = false;
  }

  function goToPage(n) {
    if (n < 0 || n >= totalPages) return;
    currentPage = n;

    const pageEls = pult.querySelectorAll('.page');
    pageEls.forEach((el, i) => {
      el.style.transform = 'translateY(' + (i - currentPage) * 100 + '%)';
    });

    pagerUp.disabled = currentPage === 0;
    pagerDown.disabled = currentPage === totalPages - 1;
  }

  pagerUp.addEventListener('click', () => goToPage(currentPage - 1));
  pagerDown.addEventListener('click', () => goToPage(currentPage + 1));

  goToPage(0);
})();
