import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Select from 'react-select';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashcanIcon,
} from '@primer/octicons-react';
import IconButton from './IconButton';
import EmptyStreetImg from '../images/EmptyStreetImg';
import StickyList from './StickyList';
import { VirtualScrollable } from './Scrollable';
import CopyButton from './CopyButton';

const eventsNameExcludedByDefault = [
  'mouseEnter',
  'mouseMove',
  'mouseOver',
  'mouseOut',
  'mouseLeave',
  'pointerOver',
  'pointerMove',
  'pointerEnter',
  'pointerLeave',
  'pointerOut',
];

function EventRecord({ index, style, data }) {
  const { id, type, name, element, selector } = data[index];

  return (
    <div
      className={`w-full h-10 flex items-center text-sm ${
        index % 2 ? 'bg-gray-100' : ''
      }`}
      style={style}
    >
      <div className="p-2 flex-none w-16">{id}</div>

      <div className="p-2 flex-none w-40">{type}</div>
      <div className="p-2 flex-none w-40">{name}</div>

      <div className="p-2 flex-none w-40">{element}</div>
      <div className="p-2 flex-auto whitespace-no-wrap">{selector}</div>
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
  onChangeSortDirection,
  appendMode,
}) => {
  const listRef = useRef();
  const defaultSelectedNames = useMemo(
    () =>
      nameOptions.filter(
        (nameOption) => !eventsNameExcludedByDefault.includes(nameOption.value),
      ),
    [nameOptions],
  );
  const [selectedTypes, setSelectedTypes] = useState(typeOptions);
  const [selectedNames, setSelectedNames] = useState(defaultSelectedNames);

  useEffect(() => setSelectedTypes(typeOptions), [
    setSelectedTypes,
    typeOptions,
  ]);

  useEffect(() => setSelectedNames(defaultSelectedNames), [
    setSelectedNames,
    defaultSelectedNames,
  ]);

  const onChangeHandler = (fieldName) => (selectedOptions) => {
    if (fieldName === 'type') {
      setSelectedTypes(selectedOptions);
    }
    if (fieldName === 'name') {
      setSelectedNames(selectedOptions);
    }
  };
  const filterData = useCallback(
    (event) =>
      selectedTypes.find((type) => type.value === event.type) &&
      selectedNames.find((name) => name.value === event.name),
    [selectedNames, selectedTypes],
  );

  const getTextToCopy = () =>
    data
      .map((log) => `${log.target.toString()} - ${log.event.EventType}`)
      .join('\n');

  const onResetHandler = useCallback(() => {
    setSelectedTypes([]);
    setSelectedNames(
      nameOptions.filter(
        (eventName) => !eventsNameExcludedByDefault.includes(eventName),
      ),
    );
    reset();
  }, [setSelectedTypes, setSelectedNames, nameOptions, reset]);

  const getSortIcon = () => (
    <IconButton>
      {appendMode === 'top' ? <ChevronDownIcon /> : <ChevronUpIcon />}
    </IconButton>
  );

  const [itemCount, itemData] = useMemo(() => {
    const eventsFiltered = data.filter(filterData);
    return [eventsFiltered.length, eventsFiltered];
  }, [data, filterData]);

  return (
    <div className="editor p-4 md:h-56 flex-auto overflow-hidden">
      <div className="h-56 md:h-full w-full flex flex-col">
        <div className="h-10 flex items-center w-full text-sm font-bold">
          <div
            className="p-2 w-16 cursor-pointer flex justify-between items-center"
            onClick={onChangeSortDirection}
          >
            # {getSortIcon()}
          </div>
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

          <div className="p-2 w-40 ">element</div>
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
                  mode={appendMode}
                  ref={listRef}
                  height={height}
                  itemCount={itemCount}
                  itemData={itemData}
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
