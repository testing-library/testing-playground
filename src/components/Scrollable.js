import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AutoSizer from 'react-virtualized-auto-sizer';

const thumbStyle = {
  vertical: {
    cursor: 'pointer',
    borderRadius: 4,
    width: 5,
  },
  horizontal: {
    cursor: 'pointer',
    borderRadius: 4,
    height: 5,
  },
};

const Thumb = React.forwardRef(function Thumb(
  { style, variant, orientation, ...props },
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
      style={{
        ...style,
        ...(orientation === 'vertical'
          ? thumbStyle.vertical
          : thumbStyle.horizontal),
      }}
      className={className}
      {...props}
    />
  );
});

function HiddenThumb() {
  // for some reason the horizontal scrollbar is also rendered when we don't
  // need it. I've hidden it, as we only need vertical scrollbars atm anyways
  // The interface will still be scrollable if required, albeit without thumb.
  return <div style={{ display: 'none' }} />;
}

function Scrollable({ children, variant = 'light' }) {
  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <Scrollbars
            style={{ width, height }}
            renderThumbVertical={() => {
              return <Thumb orientation="vertical" variant={variant} />;
            }}
            renderThumbHorizontal={HiddenThumb}
          >
            <div>{children}</div>
          </Scrollbars>
        );
      }}
    </AutoSizer>
  );
}

function VirtualScrollableComponent(props) {
  const { forwardedRef, style, children, className, onScroll } = props;

  const refSetter = useCallback((scrollbarsRef) => {
    forwardedRef?.(scrollbarsRef?.view || null);
  }, []);

  return (
    <Scrollbars
      ref={refSetter}
      style={{ ...style, overflow: 'hidden' }}
      className={className}
      onScroll={onScroll}
      renderThumbVertical={() => {
        return <Thumb orientation="vertical" />;
      }}
      renderThumbHorizontal={() => {
        return <Thumb orientation="horizontal" />;
      }}
      hideTracksWhenNotNeeded={true}
    >
      {children}
    </Scrollbars>
  );
}

// eslint-disable-next-line react/display-name
export const VirtualScrollable = React.forwardRef((props, ref) => {
  return <VirtualScrollableComponent {...props} forwardedRef={ref} />;
});

export default Scrollable;
