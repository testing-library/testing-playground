import React from 'react';
import Bridge from 'crx-bridge';

import inspectedWindow from '../lib/inspectedWindow';

// we don't use octicons here, as that style doesn't really fit in devtools
import SelectIcon from './Icons/SelectIcon';
import LayersIcon from './Icons/LayersIcon';
import InspectIcon from './Icons/InspectIcon';
import SettingsIcon from './Icons/SettingsIcon';
import LogIcon from './Icons/LogIcon';
import { Menu, MenuButton, MenuPopover } from '../../../../src/components/Menu';
import Settings from '../../../../src/components/Settings';
import { getSettings, setSettings } from '../lib/settings';

function MenuBar({ cssPath, suggestion }) {
  return (
    <div className="h-8 p-2 border-b space-x-4 flex">
      <button
        className="focus:outline-none"
        title="select element"
        onClick={() => {
          Bridge.sendMessage('TOGGLE_INSPECTING', null, 'content-script');
        }}
      >
        <SelectIcon />
      </button>

      <button
        className="focus:outline-none"
        title="clear highlights"
        onClick={() =>
          Bridge.sendMessage('CLEAR_HIGHLIGHTS', null, 'content-script')
        }
      >
        <LayersIcon />
      </button>

      <div className="flex-auto" />

      <Menu>
        <MenuButton>
          <SettingsIcon />
        </MenuButton>

        <MenuPopover>
          <Settings
            dispatch={({ type, ...data }) => {
              if (type === 'SET_SETTINGS') {
                setSettings(data);
              }
            }}
            settings={getSettings()}
          />
        </MenuPopover>
      </Menu>

      <button
        className="focus:outline-none"
        title="Inspect the matching DOM element"
        disabled={!cssPath}
        onClick={() => inspectedWindow.inspect(cssPath.toString())}
      >
        <InspectIcon />
      </button>

      <button
        className="focus:outline-none"
        title="Log the suggested query and result to console"
        disabled={!suggestion?.expression}
        onClick={() => inspectedWindow.logQuery(suggestion?.expression)}
      >
        <LogIcon />
      </button>
    </div>
  );
}

export default MenuBar;
