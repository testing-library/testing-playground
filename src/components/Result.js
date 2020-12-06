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
      <div className="flex flex-col relative w-full h-full top-0 left-0">
        <EmptyPane />
      </div>
    );
  }

  const { queries } = result.elements[0];
  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      data-testid="result"
    >
      <Scrollable>
        <div className="pb-4 border-b">
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
