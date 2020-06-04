import React from 'react';
import icon from '../../public/code_thinking.png';

function AddHtml() {
  return (
    <div className="flex-auto h-1 flex flex-col relative overflow-scroll justify-center items-center">
      <img className="opacity-50 h-48 w-full object-contain" src={icon} />
      <p className="opacity-50 ml-24">Try adding some html</p>
    </div>
  );
}

export default AddHtml;
