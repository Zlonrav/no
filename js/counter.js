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
  const confirmBox = document.getElementById('counter-confirm');
  const confirmDate = document.getElementById('counter-confirm-date');
  const confirmYes = document.getElementById('counter-confirm-yes');
  const confirmNo = document.getElementById('counter-confirm-no');

  if (!valueEl) return;

  let pendingDate = null;

  function render() {
    const start = window.Sober.ensureStart();
    const n = window.Sober.daysSince(start);
    const word = window.Sober.plural(n, ['день', 'дня', 'дней']);

    valueEl.textContent = n;
    wordEl.textContent = word + ' трезвости';

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

  changeBtn.addEventListener('click', openPicker);

  // Когда пользователь выбрал дату — показываем окно подтверждения
  inputEl.addEventListener('change', () => {
    if (!inputEl.value) return;

    pendingDate = inputEl.value;

    const d = new Date(pendingDate + 'T00:00:00');
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    confirmDate.textContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    confirmBox.hidden = false;
  });

  confirmYes.addEventListener('click', () => {
    if (pendingDate) {
      window.Sober.setStart(pendingDate);
      render();
    }
    confirmBox.hidden = true;
    pendingDate = null;
  });

  confirmNo.addEventListener('click', () => {
    confirmBox.hidden = true;
    pendingDate = null;
    inputEl.value = window.Sober.getStart();
  });

  render();
})();
