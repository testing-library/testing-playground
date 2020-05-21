import React, { useCallback, useRef } from 'react';

function HtmlPreview({ html }, forwardRef) {
  return (
    <div
      className="preview"
      ref={forwardRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default React.forwardRef(HtmlPreview);
