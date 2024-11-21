const http = require('http');
const url = require('url');
const { getFibonacci } = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/fibonacci' && req.method === 'GET') {
    const { n } = query;

    if (!n) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please provide a Fibonacci index as a query parameter: n');
      return;
    }

    const parsedN = parseInt(n, 10);

    if (isNaN(parsedN) || parsedN < 0) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The Fibonacci index must be a non-negative integer.');
      return;
    }

    try {
      const fibonacciNumber = getFibonacci(parsedN);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`The ${parsedN}-th Fibonacci number is ${fibonacciNumber}`);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('An error occurred while processing your request.');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

function createServer() {
  return server;
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

module.exports = { createServer };
