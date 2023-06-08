import React from 'react';
import Toggle from 'react-toggle';

import Input from './Input';

function Divider() {
  return <div className="border-b my-4 border-gray-300" />;
}

function Settings({ settings, dispatch }) {
  const handleChange = (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    dispatch({
      type: 'SET_SETTINGS',
      [event.target.name]: value,
    });
  };

  const showBehavior = typeof settings.autoRun !== 'undefined';
  const showTestingLibrary = typeof settings.testIdAttribute !== 'undefined';
  const isCookieEanbled = navigator.cookieEnabled;

  return (
    <div className="settings pb-2 text-sm ">
      {!isCookieEanbled && (
        <p
          className="border border-orange-600 px-3 py-1 text-sm font-bold text-orange-600"
          role="alert"
        >
          Cookie are not enabled, settings will not be saved.
        </p>
      )}
      <form onChange={handleChange} onSubmit={(e) => e.preventDefault()}>
        {showBehavior && (
          <div>
            <h3 className="mb-2 text-sm font-bold">Behavior</h3>
            <label className="flex items-center space-x-4">
              <Toggle
                icons={false}
                defaultChecked={settings.autoRun}
                name="autoRun"
              />
              <span>Auto-run code</span>
            </label>
          </div>
        )}

        {showBehavior && showTestingLibrary && <Divider />}

        {showTestingLibrary && (
          <div>
            <h3 className="mb-2 text-sm font-bold">Testing-Library</h3>
            <label htmlFor="test-id" className="text-xs">
              test-id attribute:
            </label>
            <Input
              defaultValue={settings.testIdAttribute}
              name="testIdAttribute"
              id="test-id"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Settings;
