const {
  calculateTip,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  add,
} = require('../src/math');

test('Should calculate total with tip', () => {
  const total = calculateTip(10, .3);
  expect(total).toBe(13);
});

test('Calculate total with default tip percentage', () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test('Convert Celcius to Fahrenheit', () => {
  const result = celsiusToFahrenheit(100);
  expect(result).toBe(212);
});

test('Convert Fahrenheit to Celcius', () => {
  const result = fahrenheitToCelsius(212);
  expect(result).toBe(100);
});

test('Should add two numbers', (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});

test('Should add two numbers async/await', async () => {
  const result = await add(2, 3);
  expect(result).toBe(5);
});
