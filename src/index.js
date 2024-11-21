const { fibonacci } = require('./app');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Please provide exactly one number as an argument.');
  process.exit(1); 
}

const num = parseInt(args[0], 10);

if (isNaN(num) || num < 0) {
  console.error('The argument must be a non-negative integer.');
  process.exit(1);
}

try {
  const result = fibonacci(num);
  console.log(`The ${num}-th Fibonacci number is ${result}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
