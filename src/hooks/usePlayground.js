import { useEffect, useState } from 'react';
import { useAppContext } from '../components/Context';
import parser from '../parser';

function usePlayground({ initialMarkup, initialQuery }) {
  const [markup, setMarkup] = useState(initialMarkup);
  const [query, setQuery] = useState(initialQuery);
  const { setParsed } = useAppContext();

  useEffect(() => {
    const parsed = parser.parse({ markup, query });
    setParsed(parsed);
  }, [markup, query]);

  return [query, setQuery, markup, setMarkup];
}

export default usePlayground;
