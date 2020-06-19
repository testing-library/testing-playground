import React, { useRef, useCallback, useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';
import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import usePlayground from '../hooks/usePlayground';
import state from '../lib/state';
import { eventMap } from '@testing-library/dom/dist/event-map';
import { VirtualScrollable } from './Scrollable';
import throttle from 'lodash.throttle';
import AutoSizer from 'react-virtualized-auto-sizer';
import IconButton from './IconButton';
import TrashcanIcon from './icons/TrashcanIcon';
import CopyButton from './CopyButton';
import EmptyStreetImg from '../images/EmptyStreetImg';
import StickyList from './StickyList';

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

function EventRecord({ index, style, data }) {
  const { id, type, name, element, selector } = data[index];

  return (
    <div
      className={`w-full h-8 flex items-center text-sm ${
        index % 2 ? 'bg-gray-100' : ''
      }`}
      style={style}
    >
      <div className="p-2 flex-none w-16">{id}</div>

      <div className="p-2 flex-none w-32">{type}</div>
      <div className="p-2 flex-none w-32">{name}</div>

      <div className="p-2 flex-none w-40">{element}</div>
      <div className="p-2 flex-auto whitespace-no-wrap">{selector}</div>
    </div>
  );
}

const noop = () => {};
function DomEvents() {
  const buffer = useRef([]);
  const previewRef = useRef();
  const listRef = useRef();

  const sortDirection = useRef('asc');
  const [appendMode, setAppendMode] = useState('bottom');
  const [{ markup, result }, dispatch] = usePlayground({
    onChange: onStateChange,
    ...initialValues,
  });

  const [eventCount, setEventCount] = useState(0);
  const [eventListeners, setEventListeners] = useState([]);

  const getSortIcon = () => (
    <IconButton>
      {sortDirection.current === 'desc' ? (
        <ChevronDownIcon />
      ) : (
        <ChevronUpIcon />
      )}
    </IconButton>
  );
  const changeSortDirection = () => {
    const newDirection = sortDirection.current === 'desc' ? 'asc' : 'desc';
    buffer.current = buffer.current.reverse();
    setAppendMode(newDirection === 'desc' ? 'top' : 'bottom');
    sortDirection.current = newDirection;
  };

  const reset = () => {
    buffer.current = [];
    setEventCount(0);
  };

  const getTextToCopy = () =>
    buffer.current
      .map((log) => `${log.target.toString()} - ${log.event.EventType}`)
      .join('\n');

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
        const log = {
          id: buffer.current.length + 1,
          type: event.event.EventType,
          name: event.event.name,
          element: event.target.tagName,
          selector: event.target.toString(),
        };
        if (sortDirection.current === 'desc') {
          buffer.current.splice(0, 0, log);
        } else {
          buffer.current.push(log);
        }

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

      <div className="editor md:h-56 flex-auto overflow-hidden">
        <div className="h-56 md:h-full w-full flex flex-col">
          <div className="h-8 flex items-center w-full text-sm font-bold">
            <div
              className="p-2 w-16 cursor-pointer"
              onClick={changeSortDirection}
            >
              # {getSortIcon('id')}
            </div>

            <div className="p-2 w-32 ">type</div>
            <div className="p-2 w-32 ">name</div>

            <div className="p-2 w-40 ">element</div>
            <div className="flex-auto p-2 flex justify-between">
              <span>selector</span>
              <div>
                <CopyButton
                  text={getTextToCopy}
                  title="copy log"
                  className="mr-5"
                />
                <IconButton title="clear event log" onClick={reset}>
                  <TrashcanIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="flex-auto relative overflow-hidden">
            {buffer.current.length === 0 ? (
              <div className="flex w-full h-full opacity-50 items-end justify-center">
                <EmptyStreetImg height="80%" />
              </div>
            ) : (
              <AutoSizer>
                {({ width, height }) => (
                  <StickyList
                    mode={appendMode}
                    ref={listRef}
                    height={height}
                    itemCount={eventCount}
                    itemData={buffer.current}
                    itemSize={32}
                    width={width}
                    outerElementType={VirtualScrollable}
                  >
                    {EventRecord}
                  </StickyList>
                )}
              </AutoSizer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DomEvents;
