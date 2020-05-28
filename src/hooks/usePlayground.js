import { useEffect, useState } from 'react';
import { initialValues } from '../constants';
import state from '../lib/state';
import { useAppContext } from '../components/Context';
import parser from '../parser';
const savedState = state.load();

function usePlayground() {
  const [markup, setMarkup] = useState(savedState.markup || initialValues.html);
  const [query, setQuery] = useState(savedState.query || initialValues.js);
  const { setParsed, htmlRoot } = useAppContext();

  useEffect(() => {
    if (!htmlRoot) {
      return;
    }

    const parsed = parser.parse({ htmlRoot, query });
    setParsed(parsed);

    state.save({ markup: markup, query: query });
    state.updateTitle(parsed.expression?.expression);
  }, [htmlRoot, markup, query]);

  return [query, setQuery, markup, setMarkup];
}

export default usePlayground;
