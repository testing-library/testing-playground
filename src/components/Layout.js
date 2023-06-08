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
    <div className="flex h-screen flex-col">
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
      <div className="flex-grow flex-shrink relative mb-8 px-8 md:h-0">
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
