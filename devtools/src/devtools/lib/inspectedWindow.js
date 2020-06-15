/* global chrome */

// We can't do this with messaging, because in Chrome, eval always runs in the
// context of the ContentScript, not in the context of Window. Maybe we can just
// do something with `useContentScriptContext: true`, maintain a log on the most
// recent(ly) used element(s), assign an id to them, and then use messaging. But
// for now, this is way easier.

function logQuery(query) {
  chrome.devtools.inspectedWindow.eval(`
    console.log('${query.replace(/'/g, "\\'")}');
    console.log(eval(${query}));
  `);
}

function inspect(cssPath) {
  chrome.devtools.inspectedWindow.eval(`
    inspect(document.querySelector('${cssPath}'));
  `);
}

export default {
  logQuery,
  inspect,
};
