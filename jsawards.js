/* ============================================================
   AWARDS.JS — список наград и логика
   ============================================================ */

(function (global) {
  const AWARDS = [
    { days: 7,    name: 'Бумажный',      color: '#c4b49a' },
    { days: 14,   name: 'Деревянный',    color: '#a0522d' },
    { days: 30,   name: 'Стеклянный',    color: '#a8d8ea' },
    { days: 90,   name: 'Оловянный',     color: '#a8a8a8' },
    { days: 180,  name: 'Алюминиевый',   color: '#c8c8cc' },
    { days: 365,  name: 'Железный',      color: '#6a6e72' },
    { days: 545,  name: 'Медный',        color: '#b87333' },
    { days: 730,  name: 'Бронзовый',     color: '#cd7f32' },
    { days: 1095, name: 'Серебряный',    color: '#c0c0c8' },
    { days: 1460, name: 'Золотой',       color: '#ffd700' },
    { days: 1825, name: 'Платиновый',    color: '#e5e4e2' },
    { days: 2190, name: 'Бриллиантовый', color: '#b9f2ff' },
    { days: 2555, name: 'Изумрудный',    color: '#50c878' },
    { days: 2920, name: 'Рубиновый',     color: '#e0115f' },
    { days: 3285, name: 'Сапфировый',    color: '#0f52ba' },
    { days: 3650, name: 'Легендарный',   color: '#ff4a5a' }
  ];

  // Светлые цвета — для них текст внутри щита тёмный
  const LIGHT_COLORS = [
    '#e5e4e2', '#c8c8cc', '#c0c0c8', '#a8d8ea', '#b9f2ff', '#ffd700', '#c4b49a'
  ];

  function getTextColor(color) {
    return LIGHT_COLORS.includes(color) ? '#1a1a1a' : '#ffffff';
  }

  function shieldSVG(color, days, size) {
    const textColor = getTextColor(color);
    return `
      <svg viewBox="0 0 80 80" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 6 L68 16 L68 40 C68 58 54 70 40 76 C26 70 12 58 12 40 L12 16 Z"
              fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linejoin="round"/>
        <text x="40" y="48" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="${textColor}">${days}</text>
      </svg>
    `;
  }

  global.Awards = {
    list: AWARDS,
    shieldSVG: shieldSVG,
    getTextColor: getTextColor
  };
})(window);
