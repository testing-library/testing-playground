import React, { useState, useEffect, useRef, useMemo } from 'react';
import Scrollable from './Scrollable';
import PreviewHint from './PreviewHint';
import AddHtml from './AddHtml';
import { getQueryAdvise } from '../lib';

function selectByCssPath(rootNode, cssPath) {
  return rootNode?.querySelector(cssPath.replace(/^body > /, ''));
}

function Preview({ markup, accessibleRoles, elements, dispatch }) {
  // Okay, listen up. `highlighted` can be a number of things, as I wanted to
  // keep a single variable to represent the state. This to reduce bug count
  // by creating out-of-sync states.
  //
  // 1. When the mouse pointer enters the preview area, `highlighted` changes
  //    to true. True indicates that the highlight no longer indicates the parsed
  //    element.
  // 2. When the mouse pointer is pointing at an element, `highlighted` changes
  //    to the target element. A dom node.
  // 3. When the mouse pointer leaves that element again, `highlighted` changse
  //    back to... true. Not to false! To indicate that we still want to use
  //    the mouse position to control the highlight.
  // 4. Once the mouse leaves the preview area, `highlighted` switches to false.
  //    Indicating that the `parsed` element can be highlighted again.
  const [highlighted, setHighlighted] = useState(false);
  const [roles, setRoles] = useState([]);
  const htmlRoot = useRef();

  const { suggestion } = getQueryAdvise({
    rootNode: htmlRoot?.current,
    element: highlighted,
  });

  // TestingLibraryDom?.getSuggestedQuery(highlighted, 'get').toString() : null

  const scripts = useMemo(() => {
    const container = document.createElement('div');
    container.innerHTML = markup;
    const scriptsCollections = container.getElementsByTagName('script');
    return Array.from(scriptsCollections)
      .filter(
        (script) => script.type === 'text/javascript' || script.type === '',
      )
      .map((script) => ({
        scriptCode: script.innerHTML,
        toBeRemoved: script.outerHTML,
      }));
  }, [markup]);

  const actualMarkup = useMemo(
    () =>
      scripts.length
        ? scripts.reduce(
            (html, script) => html.replace(script.toBeRemoved, ''),
            markup,
          )
        : markup,
    [scripts, markup],
  );

  useEffect(() => {
    if (scripts.length) {
      try {
        scripts.forEach((script) => {
          window.eval(script.scriptCode);
        });
      } catch {
        return;
      }
    }
  }, [scripts]);

  useEffect(() => {
    setRoles(Object.keys(accessibleRoles || {}).sort());
  }, [accessibleRoles]);

  useEffect(() => {
    if (highlighted) {
      elements?.forEach((el) => {
        const target = selectByCssPath(htmlRoot.current, el.cssPath);
        target?.classList.remove('highlight');
      });
      highlighted.classList?.add('highlight');
    } else {
      highlighted?.classList?.remove('highlight');

      if (highlighted === false) {
        elements?.forEach((el) => {
          const target = selectByCssPath(htmlRoot.current, el.cssPath);
          target?.classList.add('highlight');
        });
      }
    }

    return () => highlighted?.classList?.remove('highlight');
  }, [highlighted, elements]);

  const handleClick = (event) => {
    if (event.target === htmlRoot.current) {
      return;
    }

    event.preventDefault();
    const expression =
      suggestion.expression ||
      '// No recommendation available.\n// Add some html attributes, or\n// use container.querySelector(…)';
    dispatch({ type: 'SET_QUERY', query: expression });
  };

  const handleMove = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target === highlighted) {
      return;
    }

    if (target === htmlRoot) {
      setHighlighted(true);
      return;
    }

    setHighlighted(target);
  };

  return markup ? (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <div className="flex-auto relative overflow-hidden h-1">
        <Scrollable>
          <div
            className="preview"
            onClick={handleClick}
            onMouseMove={handleMove}
            ref={htmlRoot}
            dangerouslySetInnerHTML={{
              __html: actualMarkup,
            }}
          />
        </Scrollable>
      </div>

      <PreviewHint roles={roles} suggestion={suggestion} />
    </div>
  ) : (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <AddHtml />
    </div>
  );
}

export default React.memo(Preview);
