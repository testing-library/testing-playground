import { useEffect, useState } from 'react';
import state from '../lib/state';
import { useAppContext } from '../components/Context';
import parser from '../parser';

function usePlayground({ initialMarkup, initialQuery }) {
  const [markup, setMarkup] = useState(initialMarkup);
  const [query, setQuery] = useState(initialQuery);
  const { setParsed, htmlRoot } = useAppContext();

  useEffect(() => {
    if (!htmlRoot) {
      return;
    }

    const parsed = parser.parse({ htmlRoot, query });
    setParsed(parsed);

    state.updateTitle(parsed.expression?.expression);
  }, [htmlRoot, markup, query]);

  return [query, setQuery, markup, setMarkup];
}

export default usePlayground;
