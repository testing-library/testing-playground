import React, { Suspense } from 'react';
import { useState } from 'react';

import Query from './Query';
import Result from './Result';
import TabButton from './TabButton';

const panels = ['Query', 'Events'];

const DomEvents = React.lazy(() => import('./DomEvents'));

function Paper({ children }) {
  return (
    <div className="editor flex-auto grid-cols-1 gap-4 p-4 md:h-56 md:grid-cols-2 md:gap-8">
      {children}
    </div>
  );
}

function PlaygroundPanels({ state, dispatch }) {
  const { query, result } = state;
  const [panel, setPanel] = useState(panels[0]);

  return (
    <>
      <div className="flex h-8 gap-4 px-4 pb-1 pt-3">
        <div className="flex items-center">
          <div className="space-x-2 text-left">
            {panels.map((panelName) => (
              <TabButton
                key={panelName}
                onClick={() => setPanel(panelName)}
                active={panelName === panel}
              >
                {panelName}
              </TabButton>
            ))}
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        {panel === panels[0] && (
          <Paper>
            <div className="relative h-56 flex-auto md:h-full">
              <Query query={query} result={result} dispatch={dispatch} />
            </div>

            <div className="h-56 flex-auto overflow-hidden md:h-full">
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
