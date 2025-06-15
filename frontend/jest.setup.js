require('@testing-library/jest-dom');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

beforeAll(() => {
  const originalConsoleError = console.error;
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('ReactDOMTestUtils.act') ||
        msg.includes('createObjectURL') ||
        msg.includes('revokeObjectURL'))
    ) return;

    originalConsoleError(msg, ...args);
  });
});
