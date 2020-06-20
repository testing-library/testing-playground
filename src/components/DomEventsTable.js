import React, { useRef, useState, useCallback } from 'react';
import IconButton from './IconButton';
import TrashcanIcon from './icons/TrashcanIcon';
import EmptyStreetImg from '../images/EmptyStreetImg';
import StickyList from './StickyList';
import { VirtualScrollable } from './Scrollable';
import AutoSizer from 'react-virtualized-auto-sizer';
import CopyButton from './CopyButton';
import Select from 'react-select';

const defaultNamesOptions = [
  { label: 'mouseEnter', value: 'mouseEnter' },
  { label: 'mouseMove', value: 'mouseMove' },
  { label: 'mouseOver', value: 'mouseOver' },
  { label: 'mouseOut', value: 'mouseOut' },
  { label: 'mouseLeave', value: 'mouseLeave' },
  { label: 'pointerOver', value: 'pointerOver' },
  { label: 'pointerMove', value: 'pointerMove' },
  { label: 'pointerEnter', value: 'pointerEnter' },
  { label: 'pointerLeave', value: 'pointerLeave' },
  { label: 'pointerOut', value: 'pointerOut' },
];

function EventRecord({ index, style, data }) {
  const { id, event, target } = data[index];

  return (
    <div
      className={`w-full h-10 flex items-center text-sm ${
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

function SelectHeader({ label, options, onChange, value }) {
  const valueContainer = () => label;

  const styles = {
    control: (style) => ({
      ...style,
      paddingLeft: '0.5rem',
    }),
    option: (style, { isSelected }) => ({
      ...style,
      color: 'black',
      backgroundColor: isSelected ? '#f2f2f2' : 'white',
      fontWeight: 400,
      ':active': {
        backgroundColor: 'white',
      },
    }),
    input: (style) => ({
      ...style,
      marginBottom: 0,
    }),
    menu: (style) => ({
      ...style,
      marginTop: 0,
    }),
  };

  return (
    <Select
      styles={styles}
      options={options}
      components={{
        ValueContainer: valueContainer,
      }}
      isMulti
      isSearchable
      dropdownAlign={{ offset: [0, 0] }}
      onChange={onChange}
      hideSelectedOptions={false}
      value={value}
    />
  );
}

const DomEventsTable = ({
  reset,
  data,
  eventCount,
  typeOptions,
  nameOptions,
}) => {
  const listRef = useRef();
  const [selectedTypes, setSelectedTypes] = useState(typeOptions);
  const [selectedNames, setSelectedNames] = useState(defaultNamesOptions);
  const onChangeHandler = (fieldName) => (selectedOptions) => {
    if (fieldName === 'type') {
      setSelectedTypes(selectedOptions);
    }
    if (fieldName === 'name') {
      setSelectedNames(selectedOptions);
    }
  };

  const filterData = ({ event }) => {
    if (selectedTypes.length && selectedNames.length) {
      return (
        selectedTypes.find((type) => type.value === event.EventType) &&
        selectedNames.find((name) => name.value === event.name)
      );
    }
    if (selectedTypes.length) {
      return selectedTypes.find((type) => type.value === event.EventType);
    }
    if (selectedNames.length) {
      return selectedNames.find((name) => name.value === event.name);
    }
    return true;
  };

  const getTextToCopy = () =>
    data
      .map((log) => `${log.target.toString()} - ${log.event.EventType}`)
      .join('\n');

  const onResetHandler = useCallback(() => {
    setSelectedTypes([]);
    setSelectedNames(defaultNamesOptions);
    reset();
  }, [setSelectedTypes, setSelectedNames, reset]);

  return (
    <div className="editor md:h-56 flex-auto overflow-hidden">
      <div className="h-56 md:h-full w-full flex flex-col">
        <div className="h-8 flex items-center w-full text-sm font-bold">
          <div className="p-2 w-16">#</div>

          <div className="pr-2 py-2 w-40">
            <SelectHeader
              label="type"
              options={typeOptions}
              onChange={onChangeHandler('type')}
              value={[...selectedTypes]}
            />
          </div>
          <div className="pr-2 py-2 w-40">
            <SelectHeader
              label="name"
              options={nameOptions}
              onChange={onChangeHandler('name')}
              value={[...selectedNames]}
            />
          </div>

          <div className="p-2 w-40">element</div>
          <div className="flex-auto p-2 flex justify-between">
            <span>selector</span>
            <div>
              <CopyButton
                text={getTextToCopy}
                title="copy log"
                className="mr-5"
              />
              <IconButton title="clear event log" onClick={onResetHandler}>
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
                  itemCount={data.filter(filterData).length}
                  itemData={data.filter(filterData)}
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
