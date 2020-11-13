import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  createContext,
} from 'react';
import throttle from 'lodash.throttle';

import { addLoggingEvents } from '../lib/domEvents';

const PreviewEventsContext = createContext();
const PreviewEventsActionsContext = createContext();

export function PreviewEventsProvider({ children }) {
  const buffer = useRef([]);
  const previewRef = useRef();
  const sortDirection = useRef('asc');
  const [appendMode, setAppendMode] = useState('bottom');
  const [eventCount, setEventCount] = useState(0);
  const [eventListeners, setEventListeners] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const flush = useCallback(
    throttle(() => setEventCount(buffer.current.length), 16, {
      leading: false,
    }),
    [setEventCount],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PreviewEventsContext.Provider
      value={{
        previewRef: setPreviewRef,
        appendMode,
        eventCount,
        buffer,
        sortDirection,
      }}
    >
      <PreviewEventsActionsContext.Provider
        value={{ changeSortDirection, reset }}
      >
        {children}
      </PreviewEventsActionsContext.Provider>
    </PreviewEventsContext.Provider>
  );
}

export function usePreviewEvents() {
  const context = useContext(PreviewEventsContext);

  if (!context) {
    throw new Error(
      `usePreviewEvents must be used within PreviewEventsProvider`,
    );
  }

  return context;
}

export function usePreviewEventsActions() {
  const context = useContext(PreviewEventsActionsContext);

  if (!context) {
    throw new Error(
      `usePreviewEventsActions must be used within PreviewEventsProvider`,
    );
  }

  return context;
}
