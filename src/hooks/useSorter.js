import React from 'react';

function defaultSorter(data, sortBy, direction) {
  return [...data].sort((row1, row2) => {
    const sortInt = `${row1[sortBy]}`.localeCompare(
      `${row2[sortBy]}`,
      undefined,
      { numeric: true },
    );
    return direction === 'desc' ? -sortInt : sortInt;
  });
}

function useSorter({
  rows = [],
  sortBy,
  sortDirection = 'desc',
  sortByFn = defaultSorter,
}) {
  if (!Array.isArray(rows)) {
    throw Error('rows should be an array');
  }

  if (sortDirection !== 'desc' && sortDirection !== 'asc') {
    throw Error('sort direction can be desc or asc');
  }

  const sortedRows = React.useMemo(() => {
    const sortedRows = sortByFn(rows, sortBy, sortDirection);
    return sortedRows;
  }, [JSON.stringify(rows), sortBy, sortByFn, sortDirection]);

  return [sortedRows, rows];
}

export default useSorter;
