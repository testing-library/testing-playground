function postMessage(target, action) {
  if (!target || !target.postMessage) {
    return;
  }

  target.postMessage(
    {
      source: 'testing-playground',
      ...action,
    },
    target.origin,
  );
}

export default postMessage;
