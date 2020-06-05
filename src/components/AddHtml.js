import React from 'react';
import icon from '../../public/code_thinking.png';

function AddHtml() {
  return (
    <div className="flex-auto absolute overflow-hidden h-full w-full flex flex-col justify-center items-center">
      <div className="h-48 overflow-hidden w-full flex item-center">
        <img
          className="flex-auto resize opacity-50 object-contain max-h-full min-h-0"
          src={icon}
        />
      </div>
      <p className="opacity-50 ml-24">Try adding some html</p>
    </div>
  );
}

export default AddHtml;
