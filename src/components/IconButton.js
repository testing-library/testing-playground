import React from 'react';

function IconButton({ children, variant, onClick, className }) {
  return (
    <button
      className={[
        `pointer inline-flex focus:outline-none rounded-full flex items-center justify-center`,
        variant === 'dark'
          ? 'text-gray-600 hover:text-gray-400'
          : 'text-gray-400 hover:text-gray-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
