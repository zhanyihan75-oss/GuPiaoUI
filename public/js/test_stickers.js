(function() {
  console.log('=== STICKER DEBUG ===');
  const stickers = document.querySelectorAll('.sticker');
  console.log('Found', stickers.length, 'stickers');
  
  stickers.forEach((s, i) => {
    console.log('--- Sticker ' + i + ' ---');
    console.log('  className:', s.className);
    console.log('  textContent:', s.textContent.trim());
    console.log('  offsetParent:', s.offsetParent ? s.offsetParent.className : 'null');
    console.log('  offsetLeft:', s.offsetLeft, 'offsetTop:', s.offsetTop);
    console.log('  getBoundingClientRect:', s.getBoundingClientRect());
    console.log('  computed transform:', getComputedStyle(s).transform);
    console.log('  computed position:', getComputedStyle(s).position);
    console.log('  computed zIndex:', getComputedStyle(s).zIndex);
    console.log('  computed pointerEvents:', getComputedStyle(s).pointerEvents);
    console.log('  has mousedown listener?', s.onmousedown !== null);
    
    // Try manual drag test
    let manualDrag = false;
    let mx = 0, my = 0;
    s.addEventListener('mousedown', (e) => {
      console.log('MANUAL mousedown fired!');
      manualDrag = true;
      mx = e.clientX;
      my = e.clientY;
      s.style.transition = 'none';
      s.style.zIndex = '100';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!manualDrag) return;
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      console.log('Manual drag dx:', dx, 'dy:', dy);
      s.style.transform = s.style.transform.replace(/translate\([^)]+\)/, 'translate(' + dx + 'px, ' + dy + 'px)');
    });
    
    document.addEventListener('mouseup', () => {
      if (!manualDrag) return;
      manualDrag = false;
      s.style.zIndex = '3';
      console.log('Manual drag released');
    });
  });
  
  // Check about-grid
  const grid = document.querySelector('.about-grid');
  console.log('--- about-grid ---');
  console.log('  exists:', !!grid);
  if (grid) {
    console.log('  getBoundingClientRect:', grid.getBoundingClientRect());
    console.log('  offsetWidth:', grid.offsetWidth, 'offsetHeight:', grid.offsetHeight);
    console.log('  computed min-height:', getComputedStyle(grid).minHeight);
  }
})();
