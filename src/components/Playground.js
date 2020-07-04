import React from 'react';
import { useParams } from 'react-router-dom';
import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import Result from './Result';
import Query from './Query';
import usePlayground from '../hooks/usePlayground';
import Layout from './Layout';
import frog from 'url:~/public/128-production.png';

function Loader({ loading }) {
  return (
    <div
      className={[
        'w-full h-full absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full space-y-4 fade',
        loading ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <img className="opacity-50" src={frog} />
    </div>
  );
}

function Paper({ children }) {
  return (
    <div className="editor p-4 gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
      {children}
    </div>
  );
}

function Playground() {
  const { gistId, gistVersion } = useParams();
  const [state, dispatch] = usePlayground({ gistId, gistVersion });
  const { markup, query, result, status, dirty, settings } = state;

  const isLoading = status === 'loading';

  return (
    <Layout
      dispatch={dispatch}
      gistId={gistId}
      dirty={dirty}
      status={status}
      settings={settings}
    >
      <Loader loading={isLoading} />
      <div
        className={[
          'flex flex-col h-auto md:h-full w-full fade',
          isLoading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <Paper>
          <div className="flex-auto relative h-56 md:h-full">
            <MarkupEditor markup={markup} dispatch={dispatch} />
          </div>

          <div className="flex-auto h-56 md:h-full">
            <Preview
              markup={markup}
              elements={result?.elements}
              accessibleRoles={result?.accessibleRoles}
              dispatch={dispatch}
            />
          </div>
        </Paper>

        <div className="flex-none h-8" />

        <Paper>
          <div className="flex-auto relative h-56 md:h-full">
            <Query query={query} result={result} dispatch={dispatch} />
          </div>

          <div className="flex-auto h-56 md:h-full overflow-hidden">
            <Result result={result} dispatch={dispatch} />
          </div>
        </Paper>
      </div>
    </Layout>
  );
}

export default Playground;
