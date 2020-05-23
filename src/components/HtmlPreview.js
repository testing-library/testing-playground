import React, { useState, useEffect } from 'react';
import { useAppContext } from './Context.js';
import { getQueryAdvise } from '../lib';

function HtmlPreview({ html }, forwardRef) {
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
  const { parsed, jsEditorRef } = useAppContext();

  const { advise } = getQueryAdvise({
    root: forwardRef.current,
    element: highlighted,
  });

  const handleClick = (e) => {
    e.preventDefault();
    jsEditorRef.current.setValue(advise.expression);
  };

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

  const handleMove = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target === highlighted) {
      return;
    }

    if (target === forwardRef.current) {
      setHighlighted(true);
      return;
    }

    setHighlighted(target);
  };

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <div
        className="preview flex-auto"
        ref={forwardRef}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleClick}
        onMouseMove={handleMove}
      />
      <div className="p-2 bg-gray-200 rounded text-gray-800 font-mono text-xs">
        {advise.expression && `> ${advise.expression}`}

        {!advise.expression && forwardRef.current && (
          <>
            <span className="font-bold">roles: </span>
            {Object.keys(TestingLibraryDom.getRoles(forwardRef.current))
              .sort()
              .join(', ')}
          </>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(HtmlPreview);
