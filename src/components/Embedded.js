import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';
import Preview from './Preview';
import Query from './Query';
import Result from './Result';
import MarkupEditor from './MarkupEditor';
import useParentMessaging from '../hooks/useParentMessaging';
import usePlayground from '../hooks/usePlayground';
import Loader from './Loader';

import { defaultPanes } from '../constants';

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
function Embedded(props) {
  const params = useParams();
  const [state, dispatch] = usePlayground({
    gistId: props.gistId || params.gistId,
    gistVersion: props.gistVersion || params.gistVersion,
  });
  const { markup, query, result, status } = state;
  const isLoading = status === 'loading';
  // props.height because it describes better, params.maxheight because oembed
  const height = props.height || params.maxheight || params.height;

  const location = useLocation();
  const searchParams = queryString.parse(location.search);

  const panes = props.panes
    ? props.panes
    : searchParams.panes
    ? searchParams.panes
        .split(',')
        .map((x) => x.trim())
        .filter((x) => SUPPORTED_PANES[x])
    : defaultPanes;

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
    if (window === top) {
      return;
    }

    document.body.classList.add('embedded');
    return () => document.body.classList.remove('embedded');
  }, []);

  useParentMessaging(dispatch);

  return (
    <div
      className="relative w-full h-screen"
      style={height ? { height } : undefined}
    >
      <Loader loading={isLoading} />
      <div
        className={[
          `h-full overflow-hidden grid grid-flow-col gap-4 p-4 bg-white shadow rounded fade`,
          columnClass,
          isLoading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
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

        {panes.map((area, idx) => {
          switch (area) {
            case 'preview':
              return (
                <Preview
                  key={`${area}-${idx}`}
                  markup={markup}
                  elements={result?.elements}
                  accessibleRoles={result?.accessibleRoles}
                  dispatch={dispatch}
                />
              );
            case 'markup':
              return (
                <MarkupEditor
                  key={`${area}-${idx}`}
                  markup={markup}
                  dispatch={dispatch}
                />
              );
            case 'query':
              return (
                <Query
                  key={`${area}-${idx}`}
                  query={query}
                  result={result}
                  dispatch={dispatch}
                  variant="minimal"
                />
              );
            case 'result':
              return (
                <Result
                  key={`${area}-${idx}`}
                  result={result}
                  dispatch={dispatch}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export default Embedded;
