/* ============================================================
   AWARDS.JS — список наград и логика
   ============================================================ */

(function (global) {
  const AWARDS = [
    { days: 7,    name: 'Бумажный щит',      color: '#c4b49a', text: 'Первая неделя. Начало положено. Ты молодец!' },
    { days: 14,   name: 'Деревянный щит',    color: '#a0522d', text: 'Две недели. Ты уже знаешь, что вечер можно прожить без стакана. Это знание остаётся с тобой.' },
    { days: 30,   name: 'Стеклянный щит',    color: '#a8d8ea', text: 'Месяц. Уже не эксперимент. Уже привычка.' },
    { days: 90,   name: 'Оловянный щит',     color: '#a8a8a8', text: 'Три месяца. Тело и голова начали меняться. Ты это чувствуешь.' },
    { days: 180,  name: 'Алюминиевый щит',   color: '#c8c8cc', text: 'Полгода. Позади то, что казалось невозможным. Впереди то, что теперь реально.' },
    { days: 365,  name: 'Железный щит',      color: '#6a6e72', text: 'Один год. Первый большой рубеж. Год назад ты был другим.' },
    { days: 545,  name: 'Медный щит',        color: '#b87333', text: 'Полтора года. Давно уже не «бросил» — просто не пьёшь.' },
    { days: 730,  name: 'Бронзовый щит',     color: '#cd7f32', text: 'Два года. Ты стал другим человеком. Тихо и без фанфар.' },
    { days: 1095, name: 'Серебряный щит',    color: '#c0c0c8', text: 'Три года. Трезвость — уже не подвиг, а часть тебя.' },
    { days: 1460, name: 'Золотой щит',       color: '#ffd700', text: 'Четыре года. Ты доказал, что можешь. Теперь — просто живёшь.' },
    { days: 1825, name: 'Платиновый щит',    color: '#e5e4e2', text: 'Пять лет. Половина десятилетия. Внушительно. Поздравляю!' },
    { days: 2190, name: 'Бриллиантовый щит', color: '#b9f2ff', text: 'Шесть лет. Редкость. Мало кто доходит, но ты дошёл.' },
    { days: 2555, name: 'Изумрудный щит',    color: '#50c878', text: 'Семь лет. Ты в числе тех, кто действительно изменил свою жизнь.' },
    { days: 2920, name: 'Рубиновый щит',     color: '#e0115f', text: 'Восемь лет. Твоя награда — не щит, а жизнь.' },
    { days: 3285, name: 'Сапфировый щит',    color: '#0f52ba', text: 'Девять лет. Цифра почти не имеет значения. Важен каждый день.' },
    { days: 3650, name: 'Легендарный щит',   color: '#ff4a5a', text: 'Десять лет. Легенда! Не потому что щит такой, а потому что ты такой!' }
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
    const gradId = 'g-' + color.replace('#', '') + '-' + days;
    return `
      <svg viewBox="0 0 80 80" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.65"/>
          </linearGradient>
        </defs>
        <path d="M40 6 L68 16 L68 40 C68 58 54 70 40 76 C26 70 12 58 12 40 L12 16 Z"
              fill="url(#${gradId})"
              stroke="rgba(0,0,0,0.25)"
              stroke-width="1.5"
              stroke-linejoin="round"/>
        <path d="M40 9 L65 18 L65 40 C65 56 53 67 40 72"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              stroke-width="1"
              stroke-linejoin="round"/>
        <path d="M40 9 L15 18 L15 40 C15 56 27 67 40 72"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              stroke-width="1"
              stroke-linejoin="round"/>
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
