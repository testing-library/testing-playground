import { eventMap } from '@testing-library/dom/dist/event-map';

export function addLoggingEvents(node, log) {
  function createEventLogger(eventType) {
    return function logEvent(event) {
      if (event.target === event.currentTarget) {
        return;
      }

      log({
        event: eventType,
        target: getElementData(event.target),
      });
    };
  }
  const eventListeners = [];
  Object.keys(eventMap).forEach((name) => {
    eventListeners.push({
      name: name.toLowerCase(),
      listener: node.addEventListener(
        name.toLowerCase(),
        createEventLogger({ name, ...eventMap[name] }),
        true,
      ),
    });
  });

  return eventListeners;
}

export function getElementData(element) {
  const value =
    element.tagName === 'SELECT' && element.multiple
      ? element.selectedOptions.length > 0
        ? JSON.stringify(
            Array.from(element.selectedOptions).map((o) => o.value),
          )
        : null
      : element.value;

  const hasChecked = element.type === 'checkbox' || element.type === 'radio';

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    name: element.name || null,
    htmlFor: element.htmlFor || null,
    value: value || null,
    checked: hasChecked ? !!element.checked : null,
    toString: targetToString,
  };
}

export function targetToString() {
  return [
    this.tagName.toLowerCase(),
    this.id && `#${this.id}`,
    this.name && `[name="${this.name}"]`,
    this.htmlFor && `[for="${this.htmlFor}"]`,
    this.value && `[value="${this.value}"]`,
    this.checked !== null && `[checked=${this.checked}]`,
  ]
    .filter(Boolean)
    .join('');
}
