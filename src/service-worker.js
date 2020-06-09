import React from 'react';
import { toast } from 'react-toastify';

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
              toast(
                <p>
                  A new version is available!{' '}
                  <button
                    className="btn font-bold ml-2 pl-2 text-gray-800"
                    onClick={() => window.location.reload()}
                  >
                    REFRESH
                  </button>
                </p>,
                {
                  position: 'bottom-left',
                  autoClose: false,
                  closeOnClick: false,
                },
              );
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
