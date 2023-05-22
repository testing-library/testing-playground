import React from 'react';
import { useParams } from 'react-router-dom';
import Preview from '../components/Preview';
import MarkupEditor from '../components/MarkupEditor';
import usePlayground from '../hooks/usePlayground';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import PlaygroundPanels from '../components/PlaygroundPanels';
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
          'fade flex h-auto w-full flex-col md:h-full',
          isLoading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <div className="editor flex-auto grid-cols-1 gap-4 p-4 md:h-56 md:grid-cols-2 md:gap-8">
          <div className="relative h-56 flex-auto md:h-full">
            <MarkupEditor markup={markup} dispatch={dispatch} />
          </div>

          <div className="h-56 flex-auto md:h-full">
            <Preview
              forwardedRef={previewRef}
              markup={markup}
              elements={result?.elements}
              accessibleRoles={result?.accessibleRoles}
              dispatch={dispatch}
            />
          </div>
        </div>

        <PlaygroundPanels state={state} dispatch={dispatch} />
      </div>
    </Layout>
  );
}

export default Playground;
