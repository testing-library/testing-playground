import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from './Context';
import Scrollable from './Scrollable';
import PreviewHint from './PreviewHint';
import { getQueryAdvise } from '../lib';

function Preview({ html }) {
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
  //    Indiating that the `parsed` element can be highlighted again.
  const [highlighted, setHighlighted] = useState(false);
  const [roles, setRoles] = useState([]);

  const { parsed, jsEditorRef, htmlRoot, setHtmlRootRef } = useAppContext();
  const ref = useRef();

  const { advise } = getQueryAdvise({
    root: htmlRoot ? htmlRoot.firstChild : null,
    element: highlighted,
  });

  useEffect(() => {
    setRoles(Object.keys(parsed.roles || {}).sort());
  }, [parsed.roles]);

  useEffect(() => {
    if (highlighted) {
      parsed.targets?.forEach((el) => el.classList.remove('highlight'));
      highlighted.classList?.add('highlight');
    } else {
      highlighted?.classList?.remove('highlight');

      if (highlighted === false) {
        parsed.targets?.forEach((el) => el.classList.add('highlight'));
      }
    }

    return () => highlighted?.classList?.remove('highlight');
  }, [highlighted, parsed.targets]);

  const handleClick = (event) => {
    if (event.target === htmlRoot) {
      return;
    }

    event.preventDefault();
    const expression =
      advise.expression ||
      '// No recommendation available.\n// Add some html attributes, or\n// use container.querySelector(…)';
    jsEditorRef.current.setValue(expression);
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

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <div className="flex-auto relative overflow-hidden h-1">
        <Scrollable>
          <div
            className="preview"
            ref={setHtmlRootRef}
            onClick={handleClick}
            onMouseMove={handleMove}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Scrollable>
      </div>

      <PreviewHint roles={roles} advise={advise} />
    </div>
  );
}

export default Preview;
