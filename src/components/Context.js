import React, { useContext, useRef } from 'react';

export const AppContext = React.createContext();

function AppContextProvider(props) {
  const jsEditorRef = useRef();
  const htmlEditorRef = useRef();
  const htmlPreviewRef = useRef();

  return (
    <AppContext.Provider
      value={{ jsEditorRef, htmlEditorRef, htmlPreviewRef }}
      {...props}
    />
  );
}

function useAppContext() {
  return useContext(AppContext);
}

export { AppContextProvider, useAppContext };
