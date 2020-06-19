import React, { useRef } from 'react';
import IconButton from './IconButton';
import TrashcanIcon from './icons/TrashcanIcon';
import EmptyStreetImg from '../images/EmptyStreetImg';
import StickyList from './StickyList';
import { VirtualScrollable } from './Scrollable';
import AutoSizer from 'react-virtualized-auto-sizer';
import CopyButton from './CopyButton';


function EventRecord({ index, style, data }) {
  const { id, event, target } = data[index];

  return (
    <div
      className={`w-full h-8 flex items-center text-sm ${
        index % 2 ? 'bg-gray-100' : ''
      }`}
      style={style}
    >
      <div className="p-2 flex-none w-16">{id}</div>

      <div className="p-2 flex-none w-40">{event.EventType}</div>
      <div className="p-2 flex-none w-40">{event.name}</div>

      <div className="p-2 flex-none w-40">{target.tagName}</div>
      <div className="p-2 flex-auto whitespace-no-wrap">
        {target.toString()}
      </div>
    </div>
  );
}

const DomEventsTable = ({ reset, data, eventCount }) => {
  const listRef = useRef();

  const getTextToCopy = () =>
    data
      .map((log) => `${log.target.toString()} - ${log.event.EventType}`)
      .join('\n');

  return (
    <div className="editor md:h-56 flex-auto overflow-hidden">
      <div className="h-56 md:h-full w-full flex flex-col">
        <div className="h-8 flex items-center w-full text-sm font-bold">
          <div className="p-2 w-16">#</div>

          <div className="p-2 w-40">type</div>
          <div className="p-2 w-40">name</div>

          <div className="p-2 w-40">element</div>
          <div className="flex-auto p-2 flex justify-between">
            <span>selector</span>
            <div>
              <CopyButton
                text={getTextToCopy}
                title="copy log"
                className="mr-5"
              />
              <IconButton title="clear event log" onClick={reset}>
                <TrashcanIcon />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="flex-auto relative overflow-hidden">
          {eventCount === 0 ? (
            <div className="flex w-full h-full opacity-50 items-end justify-center">
              <EmptyStreetImg height="80%" />
            </div>
          ) : (
            <AutoSizer>
              {({ width, height }) => (
                <StickyList
                  mode="bottom"
                  ref={listRef}
                  height={height}
                  itemCount={eventCount}
                  itemData={data}
                  itemSize={32}
                  width={width}
                  outerElementType={VirtualScrollable}
                >
                  {EventRecord}
                </StickyList>
              )}
            </AutoSizer>
          )}
        </div>
      </div>
    </div>
  );
};
export default DomEventsTable;
