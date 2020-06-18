import React from 'react';

const variants = {
  dark: 'text-gray-600 hover:text-gray-400',
  light: 'text-gray-400 hover:text-gray-600',
  white: 'text-white hover:text-white',
};

function IconButton({ children, title, variant, onClick, className }) {
  const cssVariant = variants[variant] ?? variants['light'];
  return (
    <button
      className={[
        `pointer inline-flex focus:outline-none rounded-full flex items-center justify-center`,
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
