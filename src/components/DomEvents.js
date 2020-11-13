import React, { useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { TrashcanIcon } from '@primer/octicons-react';

import { VirtualScrollable } from './Scrollable';
import IconButton from './IconButton';
import CopyButton from './CopyButton';
import EmptyStreetImg from '../images/EmptyStreetImg';
import StickyList from './StickyList';
import {
  usePreviewEvents,
  usePreviewEventsActions,
} from '../context/PreviewEvents';

function EventRecord({ index, style, data }) {
  const { id, type, name, element, selector } = data[index];

  return (
    <div
      className={`w-full h-8 flex items-center text-sm ${
        index % 2 ? 'bg-gray-100' : ''
      }`}
      style={style}
    >
      <div className="p-2 flex-none w-16">{id}</div>

      <div className="p-2 flex-none w-32">{type}</div>
      <div className="p-2 flex-none w-32">{name}</div>

      <div className="p-2 flex-none w-40">{element}</div>
      <div className="p-2 flex-auto whitespace-no-wrap">{selector}</div>
    </div>
  );
}

function DomEvents() {
  const listRef = useRef();
  const { sortDirection, buffer, appendMode, eventCount } = usePreviewEvents();
  const { changeSortDirection, reset } = usePreviewEventsActions();

  const getSortIcon = () => (
    <IconButton>
      {sortDirection.current === 'desc' ? (
        <ChevronDownIcon />
      ) : (
        <ChevronUpIcon />
      )}
    </IconButton>
  );

  const getTextToCopy = () =>
    buffer.current
      .map((log) => `${log.target.toString()} - ${log.event.EventType}`)
      .join('\n');

  return (
    <div className="editor p-4 h-56 flex-auto overflow-hidden">
      <div className="h-full w-full flex flex-col">
        <div className="h-8 flex items-center w-full text-sm font-bold">
          <div
            className="p-2 w-16 cursor-pointer flex justify-between items-center"
            onClick={changeSortDirection}
          >
            # {getSortIcon()}
          </div>

          <div className="p-2 w-32 ">type</div>
          <div className="p-2 w-32 ">name</div>

          <div className="p-2 w-40 ">element</div>
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
          {buffer.current.length === 0 ? (
            <div className="flex w-full h-full opacity-50 items-end justify-center">
              <EmptyStreetImg height="80%" />
            </div>
          ) : (
            <AutoSizer>
              {({ width, height }) => (
                <StickyList
                  mode={appendMode}
                  ref={listRef}
                  height={height}
                  itemCount={eventCount}
                  itemData={buffer.current}
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
}

export default DomEvents;
