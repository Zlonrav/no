/* ============================================================
   THEME-INIT.JS — применяет тему до отрисовки страницы
   Подключается в <head> через <script src="..." ></script>
   ============================================================ */

(function () {
  try {
    var t = localStorage.getItem('theme-pref');
    document.documentElement.dataset.theme = (t === 'dark') ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
