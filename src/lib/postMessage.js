function postMessage(target, action) {
  if (!target || !target.postMessage) {
    return;
  }

  target.postMessage(
    {
      source: 'testing-playground',
      ...action,
    },
    window.location.origin,
  );
}

export default postMessage;
