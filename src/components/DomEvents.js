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
      className={`flex h-8 w-full items-center text-sm ${
        index % 2 ? 'bg-gray-100' : ''
      }`}
      style={style}
    >
      <div className="w-16 flex-none p-2">{id}</div>

      <div className="w-32 flex-none p-2">{type}</div>
      <div className="w-32 flex-none p-2">{name}</div>

      <div className="w-40 flex-none p-2">{element}</div>
      <div className="whitespace-no-wrap flex-auto p-2">{selector}</div>
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
    <div className="editor h-56 flex-auto overflow-hidden p-4">
      <div className="flex h-full w-full flex-col">
        <div className="flex h-8 w-full items-center text-sm font-bold">
          <div
            className="flex w-16 cursor-pointer items-center justify-between p-2"
            onClick={changeSortDirection}
          >
            # {getSortIcon()}
          </div>

          <div className="w-32 p-2 ">type</div>
          <div className="w-32 p-2 ">name</div>

          <div className="w-40 p-2 ">element</div>
          <div className="flex flex-auto justify-between p-2">
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

        <div className="relative flex-auto overflow-hidden">
          {buffer.current.length === 0 ? (
            <div className="flex h-full w-full items-end justify-center opacity-50">
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
