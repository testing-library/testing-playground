import React from 'react';
import frog from '~/public/icons/128-production.png';

function Loader({ loading }) {
  return (
    <div
      className={[
        'w-full h-full absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full space-y-4 fade',
        loading ? 'opacity-100' : 'hidden opacity-0',
      ].join(' ')}
    >
      <img className="opacity-50" src={frog} />
    </div>
  );
}

export default Loader;
