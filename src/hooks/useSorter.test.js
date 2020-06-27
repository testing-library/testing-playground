import { renderHook } from '@testing-library/react-hooks';
import useSorter from './useSorter';

it('should throw if data is not an array', () => {
  const { result } = renderHook(() => useSorter({ rows: {}, sortBy: 'id' }));

  expect(result.error).toEqual(Error('rows should be an array'));
});

it('should throw if sort direction is not valid', () => {
  const { result } = renderHook(() =>
    useSorter({ rows: [], sortDirection: 'invalid' }),
  );

  expect(result.error).toEqual(Error('sort direction can be desc or asc'));
});

it('should sort data by key and order', () => {
  let sortBy = 'id';
  let sortDirection = 'asc';
  const { result, rerender } = renderHook(() =>
    useSorter({
      rows: [
        {
          id: 2,
          label: 'ipsum',
        },
        {
          id: 1,
          label: 'lorem',
        },
        {
          id: 3,
          label: 'dolor',
        },
      ],
      sortBy,
      sortDirection,
    }),
  );
  expect(result.current[0]).toMatchObject([
    {
      id: 1,
      label: 'lorem',
    },
    {
      id: 2,
      label: 'ipsum',
    },
    {
      id: 3,
      label: 'dolor',
    },
  ]);

  sortDirection = 'desc';
  rerender();
  expect(result.current[0]).toMatchObject([
    {
      id: 3,
      label: 'dolor',
    },
    {
      id: 2,
      label: 'ipsum',
    },
    {
      id: 1,
      label: 'lorem',
    },
  ]);

  sortBy = 'label';
  sortDirection = 'desc';
  rerender();
  expect(result.current[0]).toMatchObject([
    {
      id: 1,
      label: 'lorem',
    },
    {
      id: 2,
      label: 'ipsum',
    },
    {
      id: 3,
      label: 'dolor',
    },
  ]);

  sortBy = 'label';
  sortDirection = 'asc';
  rerender();
  expect(result.current[0]).toMatchObject([
    {
      id: 3,
      label: 'dolor',
    },
    {
      id: 2,
      label: 'ipsum',
    },
    {
      id: 1,
      label: 'lorem',
    },
  ]);
});
