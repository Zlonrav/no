/* ============================================================
   DASHBOARD.JS — рендер плашек на главной странице
   ============================================================ */

(function () {
  const grid = document.getElementById('dashboard');
  if (!grid) return;

  const TILES = [
    {
      id: 'alcohol',
      label: 'Алкоголь',
      href: 'pages/alcohol.html',
      color: 'alcohol',
      icon: '<svg viewBox="0 0 24 24"><path d="M6 3h12l-1 8a5 5 0 0 1-10 0z"/><path d="M12 11v9"/><path d="M8 20h8"/></svg>'
    },
    {
      id: 'vape',
      label: 'Вэйп',
      href: 'pages/vape.html',
      color: 'vape',
      icon: '<svg viewBox="0 0 24 24"><rect x="10" y="14" width="4" height="6" rx="1"/><path d="M12 14v-3"/><path d="M10 8c1.3-1 2.7-1 4 0"/><path d="M9 5c1.3-1 2.7-1 4 0"/></svg>'
    },
    {
      id: 'trgz',
      label: 'ТРГЗ',
      href: 'pages/trgz.html',
      color: 'trgz',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/><path d="M12 8v5"/><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none"/></svg>'
    },
    {
      id: 'prokrutka',
      label: 'Прокрутка',
      href: 'pages/rumination.html',
      color: 'prokrutka',
      icon: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 3v6h-6"/></svg>'
    },
    {
      id: 'stress',
      label: 'Стресс',
      href: 'pages/stress.html',
      color: 'stress',
      icon: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h8l-1 8 10-12h-8z"/></svg>'
    },
    {
      id: 'breath',
      label: 'Дыхание',
      action: 'breath',
      color: 'breath',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10" opacity="0.35"/></svg>'
    },
    {
      id: 'counter',
      label: 'Трезвость',
      href: 'pages/counter.html',
      color: 'counter',
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>'
    }
  ];

  const isOdd = (TILES.length % 2) !== 0;

  TILES.forEach((tile, i) => {
    const isLast = (i === TILES.length - 1);
    const isWide = (isOdd && isLast);

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
