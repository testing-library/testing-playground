import * as TestingLibraryDom from '@testing-library/dom';

window.TestingLibraryDom = TestingLibraryDom;

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
