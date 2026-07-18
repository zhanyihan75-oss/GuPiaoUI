document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  const stickers = document.querySelectorAll('.sticker');
  console.log('Found stickers:', stickers.length);
  stickers.forEach((s, i) => {
    console.log('Sticker ' + i + ':', s.className, s.textContent);
    const cs = getComputedStyle(s);
    console.log('  transform:', cs.transform);
    console.log('  matrixValues:', cs.matrix);
  });
});
