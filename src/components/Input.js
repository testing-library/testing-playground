import React from 'react';

function Input(props) {
  return (
    <input
      className="focus:outline-none border rounded block w-full appearance-none bg-white px-3 py-2 leading-tight text-gray-800 focus:border-blue-400"
      {...props}
    />
  );
}

export default Input;
