const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const fibonacci = (n) => {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('A paraméternek egy nem negatív egész számnak kell lennie.');
  }

  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};

const testFibonacci = () => {
  console.log('Fibonacci tesztelés...');
  const testCases = [0, 1, 2, 3, 4, 5, 10, 20]; 

  testCases.forEach(n => {
    try {
      const result = fibonacci(n);
      console.log(`A(z) ${n}-edik Fibonacci szám: ${result}`);
    } catch (error) {
      console.error(`Hiba a(z) ${n}-edik Fibonacci szám számítása közben:`, error.message);
    }
  });
};

testFibonacci();

fs.readdirSync(srcDir).forEach(file => {
  if (path.extname(file) === '.js') {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);

    fs.copyFileSync(srcPath, distPath);
    console.log(`A fájl átmásolva: ${file}`);
  }
});

console.log('Build befejezve!');
