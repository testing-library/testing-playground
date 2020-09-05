import React from 'react';
import Toggle from 'react-toggle';

import Input from './Input';

function Divider() {
  return <div className="border-b border-gray-300 my-4" />;
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
  const showDarkMode = typeof settings.darkMode !== 'undefined';
  const showTestingLibrary = typeof settings.testIdAttribute !== 'undefined';

  return (
    <div className="settings text-sm pb-2">
      <form onChange={handleChange} onSubmit={(e) => e.preventDefault()}>
        {showBehavior && (
          <div>
            <h3 className="text-sm font-bold mb-2">Behavior</h3>
            <label className="flex space-x-4 items-center">
              <Toggle
                icons={false}
                defaultChecked={settings.autoRun}
                name="autoRun"
              />
              <span>Auto-run code</span>
            </label>
          </div>
        )}

        {showBehavior && showDarkMode && <Divider />}

        {showDarkMode && (
          <div>
            <h3 className="text-sm font-bold mb-2">Dark Mode</h3>
            <label className="flex space-x-4 items-center">
              <Toggle
                icons={false}
                defaultChecked={settings.darkMode}
                name="darkMode"
              />
            </label>
          </div>
        )}

        {showDarkMode && showTestingLibrary && <Divider />}

        {showTestingLibrary && (
          <div>
            <h3 className="text-sm font-bold mb-2">Testing-Library</h3>
            <label className="text-xs">test-id attribute:</label>
            <Input
              defaultValue={settings.testIdAttribute}
              name="testIdAttribute"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Settings;
