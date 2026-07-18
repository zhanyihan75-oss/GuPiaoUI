const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST = 'B:\\GuPiaoUI\\dist';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0]; // strip query params
  if (url === '/' || url === '') url = '/index.html';
  const filePath = path.join(DIST, url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] + '; charset=utf-8' || 'application/octet-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:' + PORT);
});


