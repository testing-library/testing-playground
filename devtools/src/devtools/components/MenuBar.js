import React from 'react';
import Bridge from 'crx-bridge';

import inspectedWindow from '../lib/inspectedWindow';

import SelectIcon from './SelectIcon';
import LayersIcon from './LayersIcon';
import InspectIcon from './InspectIcon';
import LogIcon from './LogIcon';

function MenuBar({ cssPath, suggestion }) {
  return (
    <div className="h-8 p-2 border-b space-x-4 flex">
      <button
        className="focus:outline-none"
        title="select element"
        onClick={() => {
          return Bridge.sendMessage('START_INSPECTING', null, 'content-script');
        }}
      >
        <SelectIcon />
      </button>

      <button
        className="focus:outline-none"
        title="clear highlights"
        onClick={() => {
          return Bridge.sendMessage('CLEAR_HIGHLIGHTS', null, 'content-script');
        }}
      >
        <LayersIcon />
      </button>

      <div className="flex-auto" />

      <button
        className="focus:outline-none"
        title="Inspect the matching DOM element"
        disabled={!cssPath}
        onClick={() => {
          return inspectedWindow.inspect(cssPath.toString());
        }}
      >
        <InspectIcon />
      </button>

      <button
        className="focus:outline-none"
        title="Log the suggested query and result to console"
        disabled={!suggestion?.expression}
        onClick={() => {
          return inspectedWindow.logQuery(suggestion?.expression);
        }}
      >
        <LogIcon />
      </button>
    </div>
  );
}

export default MenuBar;
