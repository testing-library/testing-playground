if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    const sw = '/sw.js';
    navigator.serviceWorker.register(sw).then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Update is ready!');
            } else {
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    });
  } else {
    console.log('Service Worker is not supported by browser.');
  }
}
