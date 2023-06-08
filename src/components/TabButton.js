import React from 'react';

function TabButton({ children, active, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      className={[
        'select-none border-b-2 text-xs',
        disabled ? '' : 'hover:border-blue-400 hover:text-blue-400',
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
