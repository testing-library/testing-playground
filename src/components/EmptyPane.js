import React from 'react';
import icon from 'url:~/public/code_thinking.png';

function EmptyPane() {
  return (
    <div className="flex-auto absolute overflow-hidden h-full w-full flex flex-col justify-center items-center">
      <div className="h-48 overflow-hidden w-full flex item-center">
        <img
          className="flex-auto resize opacity-50 object-contain max-h-full min-h-0"
          src={icon}
        />
      </div>
    </div>
  );
}

export default EmptyPane;
