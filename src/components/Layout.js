import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="mb-8 flex-none">
        <Header />
      </div>

      <div className="px-8 flex-grow flex-shrink">{children}</div>

      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
