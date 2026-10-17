(function() {
  function fillGrid() {
    const grids = document.querySelectorAll('.cards-grid');
    
    grids.forEach(grid => {
      // 1. Удаляем старые заглушки (если были)
      grid.querySelectorAll('.card-ghost').forEach(el => el.remove());

      // 2. Считаем реальные карточки в этой сетке
      const cards = Array.from(grid.querySelectorAll('.card'));
      if (cards.length === 0) return;

      // 3. Определяем, сколько колонок сейчас в сетке (читаем computed style)
      const gridStyle = window.getComputedStyle(grid);
      const columns = gridStyle.gridTemplateColumns.split(' ').length;

      // 4. Вычисляем, сколько карточек не хватает до полного ряда
      const remainder = cards.length % columns;
      const missing = remainder === 0 ? 0 : columns - remainder;

      // 5. Добавляем заглушки, если нужно
      for (let i = 0; i < missing; i++) {
        const ghost = document.createElement('div');
        ghost.className = 'card-ghost';
        grid.appendChild(ghost);
      }
    });
  }

  // Запускаем после загрузки страницы
  document.addEventListener('DOMContentLoaded', fillGrid);
  
  // Пересчитываем при изменении размера окна (ресайз)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fillGrid, 150);
  });
})();
