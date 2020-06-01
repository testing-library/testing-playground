import React from 'react';
import ErrorBox from './ErrorBox';
import ResultQueries from './ResultQueries';
import ResultSuggestion from './ResultSuggestion';
import { usePlayground } from './Context';
import Scrollable from './Scrollable';

function Result() {
  const { state } = usePlayground();

  if (state.result.error) {
    return (
      <ErrorBox
        caption={state.result.error.message}
        body={state.result.error.details}
      />
    );
  }

  const { data, suggestion } = state.result.elements?.[0] || {};

  if (!data || !suggestion) {
    return <div />;
  }

  return (
    <div className="flex flex-col overflow-hidden w-full h-full">
      <div className="flex-none pb-4 border-b">
        <ResultSuggestion data={data} suggestion={suggestion} />
      </div>

      <div className="flex-auto">
        <Scrollable>
          <ResultQueries data={data} suggestion={suggestion} />
        </Scrollable>
      </div>
    </div>
  );
}

export default Result;
