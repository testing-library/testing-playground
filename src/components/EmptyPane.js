import React from 'react';
import icon from '~/public/code_thinking.png';

function EmptyPane() {
  return (
    <div className="absolute flex h-full w-full flex-auto flex-col items-center justify-center overflow-hidden">
      <div className="item-center flex h-48 w-full overflow-hidden">
        <img
          className="max-h-full min-h-0 flex-auto resize object-contain opacity-50"
          src={icon}
        />
      </div>
    </div>
  );
}

export default EmptyPane;
