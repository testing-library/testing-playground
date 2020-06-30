import React from 'react';

function Input(props) {
  return (
    <input
      className="block focus:outline-none focus:border-blue-400 appearance-none border rounded w-full py-2 px-3 bg-white text-gray-800 leading-tight"
      {...props}
    />
  );
}

export default Input;
