/* global chrome */
import { getBrowserName } from './lib/utils';
const panels = chrome.devtools.panels;

const isChrome = getBrowserName() === 'Chrome';
const name = isChrome ? '🐸 Testing Playground' : 'Testing Playground';

panels.create(name, '', '/devtools/panel.html');

panels.elements.createSidebarPane(name, (sidebar) => {
  return sidebar.setPage('/devtools/pane.html');
});

function onSelectionChanged() {
  chrome.devtools.inspectedWindow.eval(
    '__TESTING_PLAYGROUND__.onSelectionChanged($0)',
    {
      useContentScriptContext: true,
    },
  );
}

panels.elements.onSelectionChanged.addListener(onSelectionChanged);

onSelectionChanged();
