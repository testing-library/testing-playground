import React from 'react';
import Header from './Header';
import { ToastContainer } from 'react-toastify';

function Layout({ children, dispatch, status, settings }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="mb-8 flex-none">
        <Header dispatch={dispatch} status={status} settings={settings} />
      </div>

      <div className="px-8 mb-8 flex-grow flex-shrink">{children}</div>

      <ToastContainer />
    </div>
  );
}

export default Layout;
