import React from 'react';
import Header from './Header';
import { ToastContainer } from 'react-toastify';

function Layout({
  children,
  dirty,
  gistId,
  gistVersion,
  dispatch,
  status,
  settings,
}) {
  return (
    <div
      className={[
        'flex flex-col h-screen',
        settings.darkMode && 'bg-gray-900',
      ].join(' ')}
    >
      <div className="mb-8 flex-none">
        <Header
          gistId={gistId}
          gistVersion={gistVersion}
          dirty={dirty}
          canSave={!!dirty}
          canFork={!!gistId}
          dispatch={dispatch}
          status={status}
          settings={settings}
        />
      </div>

      {/*not sure why, but safari needs a height here*/}
      <div className="px-8 mb-8 md:h-0 flex-grow flex-shrink relative">
        {children}
      </div>

      <ToastContainer
        position="bottom-right"
        closeOnClick
        pauseOnHover
        autoClose
        newestOnTop
      />
    </div>
  );
}

export default Layout;
