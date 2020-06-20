import React, { useRef, useCallback, useState } from 'react';

import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import usePlayground from '../hooks/usePlayground';
import state from '../lib/state';
import { eventMap } from '@testing-library/dom/dist/event-map';
import throttle from 'lodash.throttle';
import DomEventsTable from './DomEventsTable';

function onStateChange({ markup, query, result }) {
  state.save({ markup, query });
  state.updateTitle(result?.expression?.expression);
}

const initialValues = state.load() || {};

function targetToString() {
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

function getElementData(element) {
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

function addLoggingEvents(node, log) {
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

const noop = () => {};
function DomEvents() {
  const [{ markup, result }, dispatch] = usePlayground({
    onChange: onStateChange,
    ...initialValues,
  });

  const buffer = useRef([]);
  const previewRef = useRef();

  const [eventCount, setEventCount] = useState(0);
  const [eventListeners, setEventListeners] = useState([]);

  const reset = () => {
    buffer.current = [];
    setEventCount(0);
  };

  const flush = useCallback(
    throttle(() => setEventCount(buffer.current.length), 16, {
      leading: false,
    }),
    [setEventCount],
  );

  const setPreviewRef = useCallback((node) => {
    if (node) {
      previewRef.current = node;
      const eventListeners = addLoggingEvents(node, (event) => {
        event.id = buffer.current.length;
        buffer.current.push(event);
        setTimeout(flush, 0);
      });
      setEventListeners(eventListeners);
    } else if (previewRef.current) {
      eventListeners.forEach((event) =>
        previewRef.current.removeEventListener(event.name, event.listener),
      );
      previewRef.current = null;
    }
  }, []);

  const bufferValues = Object.values(buffer.current);
  const getUniqueEventsByProperty = (property) => [
    ...new Set(bufferValues.map(({ event }) => event[property])),
  ];
  const getOptionsByProperty = (property) =>
    getUniqueEventsByProperty(property).map((eventProperty) => ({
      label: eventProperty,
      value: eventProperty,
    }));

  const typeOptions = getOptionsByProperty('EventType');
  const nameOptions = getOptionsByProperty('name');

  return (
    <div className="flex flex-col h-auto md:h-full w-full">
      <div className="editor markup-editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <MarkupEditor markup={markup} dispatch={dispatch} />
        </div>

        <div className="flex-auto h-56 md:h-full">
          <Preview
            forwardedRef={setPreviewRef}
            markup={markup}
            elements={result.elements}
            accessibleRoles={result.accessibleRoles}
            dispatch={noop}
            variant="minimal"
          />
        </div>
      </div>

      <div className="flex-none h-8" />

      <DomEventsTable
        eventCount={eventCount}
        reset={reset}
        data={buffer.current}
        typeOptions={typeOptions}
        nameOptions={nameOptions}
      />
    </div>
  );
}

export default DomEvents;
