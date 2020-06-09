import 'regenerator-runtime/runtime';
import 'jest-extended';

if (window.document) {
  window.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    getBoundingClientRect: () => {
      return { right: 0 };
    },
    getClientRects: () => [],
  });
}
