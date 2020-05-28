import { useEffect, useState } from 'react';
import { initialValues } from '../constants';
import state from '../lib/state';
import { useAppContext } from '../components/Context';
import parser from '../parser';
const savedState = state.load();

function usePlayground() {
  const [html, setHtml] = useState(savedState.markup || initialValues.html);
  const [js, setJs] = useState(savedState.query || initialValues.js);
  const { setParsed, htmlRoot } = useAppContext();

  useEffect(() => {
    if (!htmlRoot) {
      return;
    }

    const parsed = parser.parse({ htmlRoot, js });
    setParsed(parsed);

    state.save({ markup: html, query: js });
    state.updateTitle(parsed.expression?.expression);
  }, [htmlRoot, html, js]);

  return [js, setJs, html, setHtml];
}

export default usePlayground;
