import React, { useState } from 'react';
import IconButton from './IconButton';
import Scrollable from './Scrollable';
import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';

function Expandable({ excerpt, children, className, variant, labelText }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className={[
        'flex w-full flex-none justify-between px-4 py-2',
        expanded ? 'expanded items-start' : 'collapsed items-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={labelText}
    >
      {expanded && (
        <div className="bg-inherit rounded-inherit absolute bottom-0 -ml-4 h-full w-full overflow-hidden">
          <Scrollable variant={variant}>
            <div className="whitespace-pre-wrap p-4">
              {children} <div className="px-4 py-2">&nbsp;</div>
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
        <div className="truncate direction mr-8 flex w-full justify-between">
          {excerpt || children}
        </div>
      )}

      <IconButton
        className="bg-inherit"
        variant={variant}
        onClick={() => setExpanded(!expanded)}
        title="expand"
      >
        <ChevronUpIcon />
      </IconButton>
    </section>
  );
}

export default Expandable;
