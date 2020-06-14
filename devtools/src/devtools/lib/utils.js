/* global chrome */
const IS_CHROME = navigator.userAgent.indexOf('Firefox') < 0;

export function getBrowserName() {
  return IS_CHROME ? 'Chrome' : 'Firefox';
}

export function getBrowserTheme() {
  if (!chrome.devtools || !chrome.devtools.panels) {
    return 'light';
  }

  return chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';
}
