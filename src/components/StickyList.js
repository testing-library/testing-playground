import React, { forwardRef, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

function StickyList(
  {
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
    if (!ref.current || !innerRef.current) {
      return;
    }

    if (innerRef.current.offsetHeight <= ref.current.props.height) {
      return;
    }

    if (mode === 'bottom') {
      ref.current.scrollTo(innerRef.current.offsetHeight);
    } else {
      ref.current.scrollTo(0);
    }
  }, [itemCount]);

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
