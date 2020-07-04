import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';
import Preview from './Preview';
import Query from './Query';
import Result from './Result';
import MarkupEditor from './MarkupEditor';
import usePlayground from '../hooks/usePlayground';

const SUPPORTED_PANES = {
  markup: true,
  preview: true,
  query: true,
  result: true,
};

const styles = {
  offscreen: {
    position: 'absolute',
    left: -300,
    width: 100,
  },
};

// TODO: we should support readonly mode
function Embedded() {
  const { gistId, gistVersion } = useParams();
  const [state, dispatch] = usePlayground({ gistId, gistVersion });
  const { markup, query, result } = state;

  const location = useLocation();
  const params = queryString.parse(location.search);

  const panes = params.panes
    ? Array.from(new Set(params.panes.split(',')))
        .map((x) => x.trim())
        .filter((x) => SUPPORTED_PANES[x])
    : ['markup', 'preview', 'query', 'result'];

  // TODO: we should add tabs to handle > 2 panes
  const areaCount = panes.length;

  // Yes, it looks like we could compose this like `grid-cols-${n}`, but that way it isn't detectable by purgeCss
  const columnClass =
    areaCount === 4
      ? 'grid-cols-4'
      : areaCount === 3
      ? 'grid-cols-3'
      : areaCount === 2
      ? 'grid-cols-2'
      : 'grid-cols-1';

  useEffect(() => {
    document.body.classList.add('embedded');
    return () => document.body.classList.remove('embedded');
  }, []);

  return (
    <div
      className={`h-full overflow-hidden grid grid-flow-col gap-4 p-4 bg-white shadow rounded ${columnClass}`}
    >
      {/*the sandbox must always be rendered!*/}
      {!panes.includes('preview') && (
        <div style={styles.offscreen}>
          <Preview
            markup={markup}
            elements={result?.elements}
            accessibleRoles={result?.accessibleRoles}
            dispatch={dispatch}
          />
        </div>
      )}

      {panes.map((area) => {
        switch (area) {
          case 'preview':
            return (
              <Preview
                key={area}
                markup={markup}
                elements={result?.elements}
                accessibleRoles={result?.accessibleRoles}
                dispatch={dispatch}
              />
            );
          case 'markup':
            return (
              <MarkupEditor key={area} markup={markup} dispatch={dispatch} />
            );
          case 'query':
            return (
              <Query
                key={area}
                query={query}
                result={result}
                dispatch={dispatch}
                variant="minimal"
              />
            );
          case 'result':
            return <Result key={area} result={result} dispatch={dispatch} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default Embedded;
