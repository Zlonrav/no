/* ============================================================
   SOBER.JS — утилиты для счётчика дней трезвости
   Используется на дашборде и на странице counter.html
   ============================================================ */

(function (global) {
  const KEY = 'sober-start';

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  function getStart() {
    let v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    return v || null;
  }

  function setStart(iso) {
    try { localStorage.setItem(KEY, iso); } catch (e) {}
  }

  function ensureStart() {
    let v = getStart();
    if (!v) {
      v = todayISO();
      setStart(v);
    }
    return v;
  }

  function daysSince(iso) {
    const start = new Date(iso + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor((today - start) / 86400000) + 1;
  }

  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }

  global.Sober = {
    todayISO: todayISO,
    getStart: getStart,
    setStart: setStart,
    ensureStart: ensureStart,
    daysSince: daysSince,
    plural: plural
  };
})(window);
