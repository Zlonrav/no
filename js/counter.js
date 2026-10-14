/* ============================================================
   COUNTER.JS — логика страницы counter.html
   ============================================================ */

(function () {
  if (!window.Sober || !window.Awards) return;

  const valueEl = document.getElementById('counter-value');
  const wordEl = document.getElementById('counter-word');
  const startEl = document.getElementById('counter-start');
  const inputEl = document.getElementById('counter-input');
  const changeBtn = document.getElementById('counter-change');
  const confirmBox = document.getElementById('counter-confirm');
  const confirmDate = document.getElementById('counter-confirm-date');
  const confirmYes = document.getElementById('counter-confirm-yes');
  const confirmNo = document.getElementById('counter-confirm-no');

  const awardsBox = document.getElementById('counter-awards');
  const awardsMore = document.getElementById('counter-awards-more');
  const awardOverlay = document.getElementById('award-overlay');
  const awardOverlayContent = document.getElementById('award-overlay-content');
  const awardOverlayClose = document.getElementById('award-overlay-close');

  if (!valueEl) return;

  let pendingDate = null;
  let showAll = false;

  function render() {
    const start = window.Sober.getStart();
    const awardsWrap = document.querySelector('.counter-awards-wrap');

    if (!start) {
      // Дата не установлена
      valueEl.textContent = '—';
      wordEl.textContent = '';
      startEl.textContent = 'Установите дату →';
      inputEl.value = '';
      if (awardsWrap) awardsWrap.hidden = true;
      return;
    }

    const n = window.Sober.daysSince(start);
    const word = window.Sober.plural(n, ['день', 'дня', 'дней']);

    valueEl.textContent = n;
    wordEl.textContent = word + ' трезвости';

    const d = new Date(start + 'T00:00:00');
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    startEl.textContent = 'с ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    inputEl.value = start;

    if (awardsWrap) awardsWrap.hidden = false;
    renderAwards(n);
  }

    const n = window.Sober.daysSince(start);
    const word = window.Sober.plural(n, ['день', 'дня', 'дней']);

    valueEl.textContent = n;
    wordEl.textContent = word + ' трезвости';

    const d = new Date(start + 'T00:00:00');
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    startEl.textContent = 'с ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    inputEl.value = start;

    if (awardsWrap) awardsWrap.hidden = false;
    renderAwards(n);
  }

  function renderAwards(days) {
    if (!awardsBox) return;

    const all = window.Awards.list;

    // Только полученные + следующий (полупрозрачный)
    const got = all.filter(a => days >= a.days);
    const next = all.find(a => days < a.days);
    const visible = next ? got.concat([next]) : got;

    awardsBox.innerHTML = '';

    visible.forEach(award => {
      const isGot = days >= award.days;
      const btn = document.createElement('button');
      btn.className = 'award-shield' + (isGot ? '' : ' locked');
      btn.type = 'button';
      btn.innerHTML = window.Awards.shieldSVG(award.color, award.days, 44);
      btn.addEventListener('click', () => openAwardOverlay(award, isGot, days));
      awardsBox.appendChild(btn);
    });
  }

  function openAwardOverlay(award, got, currentDays) {
    if (!awardOverlay || !awardOverlayContent) return;

    const remaining = award.days - currentDays;

    awardOverlayContent.innerHTML = `
      <div class="award-overlay__shield">
        ${window.Awards.shieldSVG(award.color, award.days, 120)}
      </div>
      <div class="award-overlay__name">${award.name}</div>
      <div class="award-overlay__status">
        ${got
          ? 'Получен за ' + award.days + ' дней трезвости'
          : 'До получения: ' + remaining + ' ' + window.Sober.plural(remaining, ['день', 'дня', 'дней'])
        }
      </div>
      ${got ? '<div class="award-overlay__text">' + award.text + '</div>' : ''}
    `;

    awardOverlay.hidden = false;
  }

  function closeAwardOverlay() {
    if (awardOverlay) awardOverlay.hidden = true;
  }

  // Открытие календаря
  function openPicker() {
    if (typeof inputEl.showPicker === 'function') {
      try { inputEl.showPicker(); return; } catch (e) {}
    }
    inputEl.click();
  }

  changeBtn.addEventListener('click', openPicker);

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

  // «Показать все»
  if (awardsMore) {
    awardsMore.addEventListener('click', () => {
      showAll = !showAll;
      renderAwards(window.Sober.daysSince(window.Sober.getStart()));
    });
  }

  // Закрытие оверлея
  if (awardOverlay) {
    awardOverlay.addEventListener('click', (e) => {
      if (e.target === awardOverlay) closeAwardOverlay();
    });
  }
  if (awardOverlayClose) {
    awardOverlayClose.addEventListener('click', closeAwardOverlay);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && awardOverlay && !awardOverlay.hidden) closeAwardOverlay();
  });

  render();
})();
