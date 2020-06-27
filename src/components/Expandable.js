import React, { useState } from 'react';
import IconButton from './IconButton';
import Scrollable from './Scrollable';
import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';

function Expandable({ children, className, variant }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={[
        'flex-none py-2 px-4 flex justify-between w-full',
        expanded ? 'expanded items-start' : 'collapsed items-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {expanded && (
        <div className="absolute bottom-0 -ml-4 h-full w-full overflow-hidden bg-inherit rounded-inherit">
          <Scrollable variant={variant}>
            <div className="whitespace-pre-wrap p-4">
              {children} <div className="py-2 px-4">&nbsp;</div>
            </div>
          </Scrollable>

          <IconButton
            className="bg-inherit absolute bottom-0 right-0 mx-4 my-2"
            variant={variant}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon />
          </IconButton>
        </div>
      )}

      {expanded || !children ? (
        <div>&nbsp;</div>
      ) : (
        <div className="truncate mr-8 w-full flex justify-between direction">
          {children}
        </div>
      )}

      <IconButton
        className="bg-inherit"
        variant={variant}
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronUpIcon />
      </IconButton>
    </div>
  );
}

export default Expandable;
