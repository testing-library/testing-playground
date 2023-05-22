import React from 'react';
import frog from '~/public/icons/128-production.png';

function Loader({ loading }) {
  return (
    <div
      className={[
        'fade absolute left-0 top-0 flex h-full h-full w-full w-full flex-col items-center justify-center space-y-4',
        loading ? 'opacity-100' : 'hidden opacity-0',
      ].join(' ')}
    >
      <img className="opacity-50" src={frog} />
    </div>
  );
}

export default Loader;
