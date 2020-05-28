import React, { useContext, useCallback, useRef, useState } from 'react';

export const AppContext = React.createContext();

function AppContextProvider(props) {
  const jsEditorRef = useRef();
  const htmlEditorRef = useRef();
  const [htmlRoot, setHtmlRoot] = useState();
  const [parsed, setParsed] = useState({});

  const setHtmlRootRef = useCallback(
    (node) => {
      setHtmlRoot(node);
    },
    [setHtmlRoot],
  );

  return (
    <AppContext.Provider
      value={{
        jsEditorRef,
        htmlEditorRef,
        htmlRoot,
        setHtmlRootRef,
        parsed,
        setParsed,
      }}
      {...props}
    />
  );
}

function useAppContext() {
  return useContext(AppContext);
}

export { AppContextProvider, useAppContext };
