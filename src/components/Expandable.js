import React, { useState } from 'react';
import IconButton from './IconButton';
import Scrollable from './Scrollable';

const iconStyle = { width: 24, height: 24 };
function ChevronUp() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
      />
    </svg>
  );
}

const styles = {
  expandedContent: {
    height: 'calc(100% - 1rem)',
    width: 'calc(100% - 1rem)',
  },
};

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
          <Scrollable variant={variant} minHeight="100%" maxHeight="100%">
            <div className="whitespace-pre-wrap p-4">
              {children} <div className="py-2 px-4">&nbsp;</div>
            </div>
          </Scrollable>

          <IconButton
            className="bg-inherit absolute bottom-0 right-0 mx-4 my-2"
            variant={variant}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown />
          </IconButton>
        </div>
      )}

      {expanded || !children ? (
        <div>&nbsp;</div>
      ) : (
        <div className="truncate mr-8">{children}</div>
      )}

      <IconButton
        className="bg-inherit"
        variant={variant}
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronUp />
      </IconButton>
    </div>
  );
}

export default Expandable;
