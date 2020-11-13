import React from 'react';

function TabButton({ children, active, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      className={[
        'text-xs select-none border-b-2',
        disabled ? '' : 'hover:text-blue-400 hover:border-blue-400',
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-800',
      ].join(' ')}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}

export default TabButton;
