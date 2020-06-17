import React from 'react';
import ErrorBox from './ErrorBox';
import ResultQueries from './ResultQueries';
import ResultSuggestion from './ResultSuggestion';
import Scrollable from './Scrollable';

function Result({ result, dispatch }) {
  if (result.error) {
    return (
      <ErrorBox caption={result.error.message} body={result.error.details} />
    );
  }

  if (
    !result.expression ||
    !Array.isArray(result.elements) ||
    result.elements.length === 0
  ) {
    return (
      <div className="space-y-4 text-sm">
        <div className="min-h-8">
          <p>
            I don&apos;t know what to say. This is a playground for{' '}
            <a
              href="https://testing-library.com/docs/dom-testing-library/example-intro"
              rel="noopener noreferrer"
              target="_blank"
              className="font-bold"
            >
              React Testing Library
            </a>
            .<br /> Please insert some html and queries to be adviced on which
            should be used.
          </p>
        </div>
      </div>
    );
  }
  const { data, suggestion, queries } = result.elements[0];
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex-none pb-4 border-b">
        <ResultSuggestion
          result={result}
          dispatch={dispatch}
          data={data}
          suggestion={suggestion}
        />
      </div>

      <div className="flex-auto">
        <Scrollable>
          <ResultQueries
            data={data}
            possibleQueries={queries}
            suggestion={suggestion}
            activeMethod={result.expression?.method}
            dispatch={dispatch}
          />
        </Scrollable>
      </div>
    </div>
  );
}

export default Result;
