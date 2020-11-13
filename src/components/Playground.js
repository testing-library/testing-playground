import React from 'react';
import { useParams } from 'react-router-dom';
import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import usePlayground from '../hooks/usePlayground';
import Layout from './Layout';
import Loader from './Loader';
import PlaygroundPanels from './PlaygroundPanels';
import { usePreviewEvents } from '../context/PreviewEvents';

function Playground() {
  const { gistId, gistVersion } = useParams();
  const [state, dispatch] = usePlayground({ gistId, gistVersion });
  const { markup, result, status, dirty, settings } = state;
  const { previewRef } = usePreviewEvents();

  const isLoading = status === 'loading';

  return (
    <Layout
      dispatch={dispatch}
      gistId={gistId}
      gistVersion={gistVersion}
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
        <div className="editor p-4 gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
          <div className="flex-auto relative h-56 md:h-full">
            <MarkupEditor markup={markup} dispatch={dispatch} />
          </div>

          <div className="flex-auto h-56 md:h-full">
            <Preview
              forwardedRef={previewRef}
              markup={markup}
              elements={result?.elements}
              accessibleRoles={result?.accessibleRoles}
              dispatch={dispatch}
            />
          </div>
        </div>

        <div className="flex-none h-3" />
        <PlaygroundPanels />
      </div>
    </Layout>
  );
}

export default Playground;
