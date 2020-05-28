import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AutoSizer from 'react-virtualized-auto-sizer';

const thumbStyle = {
  cursor: 'pointer',
  borderRadius: 4,
  width: 5,
};

const VerticalThumb = React.forwardRef(function VerticalThumb(
  { style, variant, ...props },
  ref,
) {
  const className =
    variant === 'error'
      ? 'bg-red-400'
      : variant === 'dark'
      ? 'bg-gray-600'
      : 'bg-gray-400';

  return (
    <div
      ref={ref}
      style={{ ...style, ...thumbStyle }}
      className={className}
      {...props}
    />
  );
});

function HorizontalThumb() {
  // for some reason the horizontal scrollbar is also rendered when we don't
  // need it. I've hidden it, as we only need vertical scrollbars atm anyways
  // The interface will still be scrollable if required, albeit without thumb.
  return <div style={{ display: 'none' }} />;
}

function Scrollable({ children, variant = 'light' }) {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <Scrollbars
          style={{ width, height }}
          renderThumbVertical={() => <VerticalThumb variant={variant} />}
          renderThumbHorizontal={HorizontalThumb}
        >
          <div>{children}</div>
        </Scrollbars>
      )}
    </AutoSizer>
  );
}

export default Scrollable;
