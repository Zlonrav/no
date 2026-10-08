/* ============================================================
   TRGZ.JS — переключение версий ТРГЗ
   ============================================================ */

(function () {
  const subButtons = document.querySelectorAll('.subtabs button');
  const versions = document.querySelectorAll('.trgz-version');
  if (!subButtons.length || !versions.length) return;

  function activateVersion(target) {
    subButtons.forEach(b => b.classList.toggle('active', b.dataset.version === target));
    versions.forEach(v => v.classList.toggle('active', v.dataset.version === target));
    try { localStorage.setItem('trgz-version', target); } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  subButtons.forEach(btn => {
    btn.addEventListener('click', () => activateVersion(btn.dataset.version));
  });

  let saved = null;
  try { saved = localStorage.getItem('trgz-version'); } catch (e) {}
  if (saved && (saved === 'intensive' || saved === 'short' || saved === 'emergency')) {
    activateVersion(saved);
  }
})();
