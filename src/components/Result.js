import React from 'react';
import ErrorBox from './ErrorBox';
import ResultQueries from './ResultQueries';
import ResultSuggestion from './ResultSuggestion';
import Scrollable from './Scrollable';
import EmptyPane from './EmptyPane';

function Result({ result, dispatch }) {
  if (result?.error) {
    return (
      <ErrorBox caption={result.error.message} body={result.error.details} />
    );
  }

  if (
    !result ||
    !Array.isArray(result.elements) ||
    result.elements.length === 0
  ) {
    return (
      <div className="relative left-0 top-0 flex h-full w-full flex-col">
        <EmptyPane />
      </div>
    );
  }

  const { queries } = result.elements[0];
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      data-testid="result"
    >
      <Scrollable>
        <div className="border-b pb-4">
          <ResultSuggestion
            result={result}
            dispatch={dispatch}
            queries={queries}
          />
        </div>

        <ResultQueries
          activeMethod={result.expression?.method}
          dispatch={dispatch}
          queries={queries}
        />
      </Scrollable>
    </div>
  );
}

export default Result;
