import { useEffect } from 'react';

function dispatchUpdateData(dispatch, { markup, query }) {
  if (markup !== undefined) {
    dispatch({ type: 'SET_MARKUP', markup });
  }

  if (query !== undefined) {
    dispatch({ type: 'SET_QUERY', query });
  }
}

function useParentMessaging(dispatch) {
  useEffect(() => {
    if (window === parent) {
      return;
    }

    const listener = ({ source, target, data }) => {
      if (source !== parent) {
        return;
      }

      if (target !== window) {
        return;
      }

      switch (data.type) {
        case 'UPDATE_DATA':
          dispatchUpdateData(dispatch, data);
          break;
        default:
          return;
      }
    };

    window.addEventListener('message', listener);

    parent.postMessage(
      {
        source: 'embedded-testing-playground',
        type: 'READY',
      },
      '*', // We don't know parent origin, so we have to send it to whoever is there
    );
    return () => window.removeEventListener('message', listener);
  }, [dispatch]);
}

export default useParentMessaging;
