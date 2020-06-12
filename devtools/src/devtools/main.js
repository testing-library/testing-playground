/* global chrome */
const panels = chrome.devtools.panels;

panels.create('Testing Playground', 'icon.png', '/devtools/panel.html');

panels.elements.createSidebarPane('Testing Playground', (sidebar) =>
  sidebar.setPage('/devtools/pane.html'),
);

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
