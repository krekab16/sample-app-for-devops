/**
 * Calculates the nth Fibonacci number.
 * @param {number} n - The position in the Fibonacci sequence (0-based index).
 * @returns {number} The nth Fibonacci number.
 * @throws {Error} If the input is not a non-negative integer.
 */
function fibonacci(n) {
    if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
        throw new Error('The argument must be a non-negative integer');
    }

    if (n === 0) return 0;
    if (n === 1) return 1;

    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

module.exports = { fibonacci };
