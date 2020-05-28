import React from 'react';
import ErrorBox from './ErrorBox';
import ResultQueries from './ResultQueries';
import ResultSuggestion from './ResultSuggestion';
import { useAppContext } from './Context';
import { getQueryAdvise } from '../lib';
import Scrollable from './Scrollable';

function Result() {
  const { parsed, htmlRoot } = useAppContext();
  const element = parsed.target;

  if (parsed.error) {
    return <ErrorBox caption={parsed.error} body={parsed.errorBody} />;
  }

  const { data, advise } = getQueryAdvise({
    root: htmlRoot,
    element,
  });

  return (
    <div className="flex flex-col overflow-hidden w-full h-full">
      <div className="flex-none pb-4 border-b">
        <ResultSuggestion data={data} advise={advise} />
      </div>

      <div className="flex-auto">
        <Scrollable>
          <ResultQueries data={data} advise={advise} />
        </Scrollable>
      </div>
    </div>
  );
}

export default Result;
