import Bridge from 'crx-bridge';

const localSettings = navigator.cookieEnabled
  ? JSON.parse(localStorage.getItem('playground_settings'))
  : {};

let _settings = Object.assign(
  {
    testIdAttribute: 'data-testid',
  },
  localSettings,
);

Bridge.sendMessage('SET_SETTINGS', _settings, 'content-script');

export function getSettings() {
  return _settings;
}

export function setSettings(settings) {
  Object.assign(_settings, settings);
  Bridge.sendMessage('SET_SETTINGS', _settings, 'content-script');
  if (navigator.cookieEnabled) {
    localStorage.setItem('playground_settings', JSON.stringify(_settings));
  }
}
