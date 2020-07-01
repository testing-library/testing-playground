import React from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
// reserved for near very near term (1 or 2 PR's)
// import Input from './Input';
// import { MenuList } from './Menu';
//
// function Divider() {
//   return <div className="border-b border-gray-300 my-4" />;
// }

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

  return (
    <div className="settings text-sm pb-2">
      <form onChange={handleChange} onSubmit={(e) => e.preventDefault()}>
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

        {/*reserved for future implementation, depends on #213 */}
        {/*<Divider />*/}

        {/*<div>*/}
        {/*  <h3 className="text-sm font-bold mb-2">Testing-Library</h3>*/}
        {/*  <label className="text-xs">test-id attribute:</label>*/}
        {/*  <Input*/}
        {/*    defaultValue={settings.testIdAttribute}*/}
        {/*    name="testIdAttribute"*/}
        {/*  />*/}
        {/*</div>*/}
      </form>
    </div>
  );
}

export default Settings;
