import React from 'react';

const variants = {
  dark: 'text-gray-500 hover:text-gray-400',
  light: 'text-gray-500 hover:text-gray-700',
  white: 'text-white hover:text-white',
};

function IconButton({ children, title, variant, onClick, className }) {
  const cssVariant = variants[variant] || variants['light'];
  return (
    <button
      className={[
        `pointer focus:outline-none flex inline-flex items-center justify-center rounded-full`,
        cssVariant,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

export default IconButton;
