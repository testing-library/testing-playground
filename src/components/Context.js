import React, { useContext, useRef, useState } from 'react';

export const AppContext = React.createContext();

function AppContextProvider(props) {
  const jsEditorRef = useRef();
  const htmlEditorRef = useRef();
  const htmlPreviewRef = useRef();
  const [parsed, setParsed] = useState({});

  return (
    <AppContext.Provider
      value={{ jsEditorRef, htmlEditorRef, htmlPreviewRef, parsed, setParsed }}
      {...props}
    />
  );
}

function useAppContext() {
  return useContext(AppContext);
}

export { AppContextProvider, useAppContext };
