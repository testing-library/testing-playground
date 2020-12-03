import React, { Suspense } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import usePlayground from '../hooks/usePlayground';

import Query from './Query';
import Result from './Result';
import TabButton from './TabButton';

const panels = ['Query', 'Events'];

const DomEvents = React.lazy(() => import('./DomEvents'));

function Paper({ children }) {
  return (
    <div className="editor p-4 gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
      {children}
    </div>
  );
}

function PlaygroundPanels() {
  const { gistId, gistVersion } = useParams();
  const [state, dispatch] = usePlayground({ gistId, gistVersion });
  const { query, result } = state;
  const [panel, setPanel] = useState(panels[0]);

  return (
    <>
      <div className="px-4 gap-4 flex py-2">
        {panels.map((panelName) => (
          <div key={panelName} className="flex items-center">
            <div className="text-left space-x-2">
              <TabButton
                onClick={() => setPanel(panelName)}
                active={panelName === panel}
              >
                {panelName}
              </TabButton>
            </div>
          </div>
        ))}
      </div>
      <Suspense fallback={null}>
        {panel === panels[0] && (
          <Paper>
            <div className="flex-auto relative h-56 md:h-full">
              <Query query={query} result={result} dispatch={dispatch} />
            </div>

            <div className="flex-auto h-56 md:h-full overflow-hidden">
              <Result result={result} dispatch={dispatch} />
            </div>
          </Paper>
        )}
        {panel === panels[1] && <DomEvents />}
      </Suspense>
    </>
  );
}

export default PlaygroundPanels;
