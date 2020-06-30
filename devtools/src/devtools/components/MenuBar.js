import React, { useState, useCallback } from 'react';
import Bridge from 'crx-bridge';
import { SettingsIcon } from '@primer/octicons-react';
import { Dialog } from '@reach/dialog';

import inspectedWindow from '../lib/inspectedWindow';

import SelectIcon from './SelectIcon';
import LayersIcon from './LayersIcon';
import InspectIcon from './InspectIcon';
import LogIcon from './LogIcon';

function MenuBar({ cssPath, suggestion }) {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [testIdCustomAttribute, setTestIdCustomAttribute] = useState(
    'data-testid',
  );

  const onClickSettingsHandler = useCallback(
    () => setSettingsModalVisible(true),
    [setSettingsModalVisible],
  );
  const onCloseSettingsModalHandler = useCallback(
    () => setSettingsModalVisible(false),
    [setSettingsModalVisible],
  );

  const onTestIdCustomAttributeChangeHandler = useCallback(
    (event) => setTestIdCustomAttribute(event.target.value),
    [setTestIdCustomAttribute],
  );

  const onClickSettingsModalOkButtonHandler = useCallback(() => {
    Bridge.sendMessage(
      'SET_CUSTOM_TEST_ID',
      { customTestIdAttribute: testIdCustomAttribute },
      'content-script',
    );
    onCloseSettingsModalHandler();
  }, [testIdCustomAttribute, onCloseSettingsModalHandler]);
  return (
    <div className="h-8 p-2 border-b space-x-4 flex">
      <button
        className="focus:outline-none"
        title="select element"
        onClick={() =>
          Bridge.sendMessage('START_INSPECTING', null, 'content-script')
        }
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

      <button
        className="focus:outline-none"
        title="View settings"
        onClick={onClickSettingsHandler}
      >
        <SettingsIcon />
      </button>
      <Dialog
        isOpen={settingsModalVisible}
        onDismiss={onCloseSettingsModalHandler}
        aria-label="settings-modal"
      >
        <input
          type="text"
          value={testIdCustomAttribute}
          onChange={onTestIdCustomAttributeChangeHandler}
        />
        <button
          onClick={onClickSettingsModalOkButtonHandler}
          disabled={!testIdCustomAttribute}
        >
          <span>Ok</span>
        </button>
      </Dialog>

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
