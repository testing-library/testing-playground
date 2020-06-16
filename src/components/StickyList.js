import React, { forwardRef, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

function StickyList(
  {
    follow = false,
    mode = 'bottom',
    height,
    itemCount,
    itemData,
    itemSize,
    width,
    outerElementType,
    children,
  },
  ref,
) {
  const innerRef = useRef();
  useEffect(() => {
    if (ref.current && follow && innerRef.current) {
      if (mode === 'bottom') {
        ref.current.scrollTo(innerRef.current.offsetHeight);
      } else if (mode === 'top') {
        ref.current.scrollTo(0);
      }
    }
  }, [itemCount, follow]);

  return (
    <List
      ref={ref}
      height={height}
      itemCount={itemCount}
      itemData={itemData}
      itemSize={itemSize}
      width={width}
      innerRef={innerRef}
      outerElementType={outerElementType}
    >
      {children}
    </List>
  );
}

export default forwardRef(StickyList);
