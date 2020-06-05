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

  if (!state.result.expression) {
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

  const { data, suggestion } = state.result.elements?.[0] || {};

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
