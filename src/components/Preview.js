import React, { useState, useEffect, useRef } from 'react';
import { usePlayground } from './Context';
import Scrollable from './Scrollable';
import PreviewHint from './PreviewHint';
import AddHtml from './AddHtml';
import { getQueryAdvise } from '../lib';

function selectByCssPath(rootNode, cssPath) {
  return rootNode?.querySelector(cssPath.replace(/^body > /, ''));
}

function Preview() {
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
  const { state, dispatch } = usePlayground();
  const htmlRoot = useRef();

  const { suggestion } = getQueryAdvise({
    rootNode: htmlRoot.current ? htmlRoot.current.firstChild : null,
    element: highlighted,
  });

  // TestingLibraryDom?.getSuggestedQuery(highlighted, 'get').toString() : null

  useEffect(() => {
    setRoles(Object.keys(state.result.accessibleRoles || {}).sort());
  }, [state.result.accessibleRoles]);

  useEffect(() => {
    if (highlighted) {
      state.result.elements?.forEach((el) => {
        const target = selectByCssPath(htmlRoot.current, el.cssPath);
        target?.classList.remove('highlight');
      });
      highlighted.classList?.add('highlight');
    } else {
      highlighted?.classList?.remove('highlight');

      if (highlighted === false) {
        state.result.elements?.forEach((el) => {
          const target = selectByCssPath(htmlRoot.current, el.cssPath);
          target?.classList.add('highlight');
        });
      }
    }

    return () => highlighted?.classList?.remove('highlight');
  }, [highlighted, state.result.elements]);

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

  return state.markup ? (
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
            dangerouslySetInnerHTML={{ __html: state.markup }}
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

export default Preview;
