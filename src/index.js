const http = require('http');
const url = require('url');
const { getFibonacciNumber } = require('./app');  
const promClient = require('prom-client');

const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prefix: 'mathapp_'
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code']
});

const calculationErrors = new promClient.Counter({
  name: 'calculation_errors_total',
  help: 'Total number of calculation errors',
  labelNames: ['error_type']
});

const calculationTotal = new promClient.Counter({
  name: 'calculations_total',
  help: 'Total number of calculations performed',
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(calculationErrors);
register.registerMetric(calculationTotal);

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {

  const startTime = process.hrtime();

  const endTimer = (statusCode) => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = seconds + nanoseconds / 1e9;
    const path = url.parse(req.url).pathname;
    
    httpRequestDuration
      .labels(req.method, path, statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, path, statusCode)
      .inc();
  };

  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/metrics' && req.method === 'GET') {
    console.log('/metrics endpoint called.');
    res.setHeader('Content-Type', register.contentType);
    try {
      const metrics = await register.metrics();
      res.writeHead(200);
      res.end(metrics);
      console.log('metrics set correctly');
      endTimer(200);
      return;
    } catch (error) {
      res.writeHead(500);
      res.end('Error collecting metrics');
      console.error('error occurred while collecting metrics');
      endTimer(500);
      return;
    }
  }

  if (pathname === '/fibonacci' && req.method === 'GET') {
    console.log('/fibonacci endpoint called.');
    const { num } = query;

    if (!num) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please provide a number as a query parameter: num');
      calculationErrors.labels('missing_parameter').inc();
      endTimer(400);
      console.error('missing query parameter at /fibonacci endpoint');
      return;
    }

    const parsedNum = parseInt(num);

    if (isNaN(parsedNum) || parsedNum <= 0) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The query parameter must be a valid positive integer.');
      calculationErrors.labels('invalid_number').inc();
      endTimer(400);
      console.error('invalid number at /fibonacci endpoint');
      return;
    }

    try {
      const fibonacci = getFibonacciNumber(parsedNum);
      calculationTotal.inc();
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`The ${parsedNum}-th Fibonacci number is ${fibonacci}`);
      endTimer(200);
      console.log(`The ${parsedNum}-th Fibonacci number is ${fibonacci}`);
    } catch (error) {
      calculationErrors.labels('calculation_error').inc();
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('An error occurred while processing your request.');
      endTimer(500);
    }
  } else if (pathname !== '/metrics') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    endTimer(404);
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
