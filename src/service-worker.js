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
          if (
            installingWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            toast(
              <p>
                A new version is available!{' '}
                <button
                  className="btn ml-2 pl-2 font-bold text-gray-800"
                  onClick={() => window.location.reload()}
                >
                  REFRESH
                </button>
              </p>,
              {
                autoClose: false,
              },
            );
          }
        };
      };
    });
  }
}
