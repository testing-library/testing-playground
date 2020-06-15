/* global chrome */

function inject(src) {
  return new Promise((resolve) => {
    const target = document.head || document.documentElement;

    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute(
      'src',
      src.includes('://') ? src : chrome.runtime.getURL(src),
    );
    script.addEventListener('load', () => {
      target.removeChild(script);
      resolve();
    });

    target.appendChild(script);
  });
}

export default inject;
