function onDocReady(fn) {
  if (document.readyState !== 'loading') {
    return fn();
  }

  setTimeout(() => {
    onDocReady(fn);
  }, 9);
}

export default onDocReady;
