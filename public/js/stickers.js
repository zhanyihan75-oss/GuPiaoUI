document.addEventListener('DOMContentLoaded', () => {
  const stickers = document.querySelectorAll('.sticker');
  
  stickers.forEach(sticker => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;  // Current translate offset relative to parent
    let dragStartX = 0, dragStartY = 0;  // Mouse position at drag start
    let savedOffsetX = 0, savedOffsetY = 0;  // Persisted between drags
    
    // Read CSS rotation from computed style matrix
    const cs = getComputedStyle(sticker);
    const matrix = cs.transform;
    let cssRotation = 0;
    if (matrix && matrix !== 'none') {
      const vals = matrix.split('(')[1].split(')')[0].split(',');
      cssRotation = Math.round(Math.atan2(parseFloat(vals[1]), parseFloat(vals[0])) * (180 / Math.PI));
      if (cssRotation < 0) cssRotation += 360;
    }
    sticker.dataset.rotation = cssRotation.toString();
    
    sticker.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      
      // Load persisted offset
      offsetX = savedOffsetX;
      offsetY = savedOffsetY;
      
      sticker.style.transition = 'none';
      sticker.style.cursor = 'grabbing';
      sticker.style.zIndex = '10';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const grid = document.querySelector('.about-grid');
      if (!grid) return;
      const gridRect = grid.getBoundingClientRect();
      const stickerRect = sticker.getBoundingClientRect();
      
      // Calculate delta in screen coords
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      let newX = offsetX + dx;
      let newY = offsetY + dy;
      
      // Clamp within grid bounds
      const maxX = gridRect.width - stickerRect.width;
      const maxY = gridRect.height - stickerRect.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      const currentRot = parseFloat(sticker.dataset.rotation || '0');
      sticker.style.transform = `translate(${newX}px, ${newY}px) rotate(${currentRot}deg)`;
    });
    
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      
      // Read final offset from computed style
      const finalCs = getComputedStyle(sticker);
      const finalMatrix = finalCs.transform;
      if (finalMatrix && finalMatrix !== 'none') {
        const vals = finalMatrix.split('(')[1].split(')')[0].split(',');
        savedOffsetX = parseFloat(vals[12]) || 0;
        savedOffsetY = parseFloat(vals[13]) || 0;
      }
      
      sticker.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      sticker.style.cursor = 'grab';
      sticker.style.zIndex = '3';
    });
    
    // Hover animation - uses saved offset
    sticker.addEventListener('mouseenter', () => {
      if (!isDragging) {
        const currentRot = parseFloat(sticker.dataset.rotation || '0');
        sticker.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        sticker.style.transform = `translate(${savedOffsetX}px, ${savedOffsetY}px) rotate(${currentRot + 3}deg) scale(1.05)`;
        sticker.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)';
      }
    });
    
    // Leave: restore without snap-back
    sticker.addEventListener('mouseleave', () => {
      if (!isDragging) {
        const currentRot = parseFloat(sticker.dataset.rotation || '0');
        sticker.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        sticker.style.transform = `translate(${savedOffsetX}px, ${savedOffsetY}px) rotate(${currentRot}deg)`;
        sticker.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)';
      }
    });
  });
});