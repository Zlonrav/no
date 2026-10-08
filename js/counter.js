/* ============================================================
   COUNTER.JS — логика страницы counter.html
   ============================================================ */

(function () {
  if (!window.Sober) return;

  const valueEl = document.getElementById('counter-value');
  const wordEl = document.getElementById('counter-word');
  const startEl = document.getElementById('counter-start');
  const inputEl = document.getElementById('counter-input');
  const changeBtn = document.getElementById('counter-change');
  const resetBtn = document.getElementById('counter-reset');

  if (!valueEl) return;

  function render() {
    const start = window.Sober.ensureStart();
    const n = window.Sober.daysSince(start);
    const word = window.Sober.plural(n, ['день', 'дня', 'дней']);

    valueEl.textContent = n;
    wordEl.textContent = word + ' трезвости';

    // Дата в формате «7 октября 2026»
    const d = new Date(start + 'T00:00:00');
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    startEl.textContent = 'с ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    inputEl.value = start;
  }

  function openPicker() {
    if (typeof inputEl.showPicker === 'function') {
      try { inputEl.showPicker(); return; } catch (e) {}
    }
    inputEl.click();
  }

  inputEl.addEventListener('change', () => {
    if (inputEl.value) {
      window.Sober.setStart(inputEl.value);
      render();
    }
  });

  changeBtn.addEventListener('click', openPicker);

  resetBtn.addEventListener('click', () => {
    if (confirm('Сбросить счётчик? Отсчёт начнётся с сегодняшнего дня.')) {
      window.Sober.setStart(window.Sober.todayISO());
      render();
    }
  });

  render();
})();
