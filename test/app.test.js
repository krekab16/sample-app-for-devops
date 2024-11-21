const { getFibonacci } = require('../src/app');
const http = require('http');
const { createServer } = require('../src/index');

describe('getFibonacci function', () => {
  test('should correctly return the 0-th Fibonacci number', () => {
    expect(getFibonacci(0)).toBe(0);
  });

  test('should correctly return the 1st Fibonacci number', () => {
    expect(getFibonacci(1)).toBe(1);
  });

  test('should correctly return the 2nd Fibonacci number', () => {
    expect(getFibonacci(2)).toBe(1);
  });

  test('should correctly return the 3rd Fibonacci number', () => {
    expect(getFibonacci(3)).toBe(2);
  });

  test('should correctly return the 5th Fibonacci number', () => {
    expect(getFibonacci(5)).toBe(5);
  });

  test('should correctly return the 10th Fibonacci number', () => {
    expect(getFibonacci(10)).toBe(55);
  });

});

describe('HTTP Server', () => {
  let server;
  const PORT = 3000;

  beforeAll((done) => {
    server = createServer();
    server.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  function makeRequest(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, data });
        });
      }).on('error', reject);
    });
  }

  test('should return correct Fibonacci number for valid n', async () => {
    const response = await makeRequest('/fibonacci?n=5');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('The 5-th Fibonacci number is 5');
  });

  test('should handle Fibonacci index 0 correctly', async () => {
    const response = await makeRequest('/fibonacci?n=0');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('The 0-th Fibonacci number is 0');
  });

  test('should handle Fibonacci index 1 correctly', async () => {
    const response = await makeRequest('/fibonacci?n=1');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('The 1-th Fibonacci number is 1');
  });

  test('should return 400 for missing Fibonacci index', async () => {
    const response = await makeRequest('/fibonacci');
    expect(response.statusCode).toBe(400);
    expect(response.data).toBe('Please provide a Fibonacci index as a query parameter: n');
  });

  test('should return 400 for invalid Fibonacci index', async () => {
    const response = await makeRequest('/fibonacci?n=abc');
    expect(response.statusCode).toBe(400);
    expect(response.data).toBe('The Fibonacci index must be a non-negative integer.');
  });

});
