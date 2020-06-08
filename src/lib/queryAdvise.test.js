import { getQueryAdvise } from './queryAdvise';

const emptyObject = `
  Object {
    "data": Object {},
    "suggestion": Object {},
  }
`;

it('should return default suggested query if none was returned by dtl', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('faketag');
  const result = getQueryAdvise({ rootNode, element });
  expect(result.suggestion.expression).toEqual('container.querySelector(…)');
});

it('should return an empty object if root node is a malformed object', () => {
  const element = document.createElement('faketag');

  let result = getQueryAdvise({ rootNode: null, element });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode: '', element });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode: {}, element });
  expect(result).toMatchInlineSnapshot(emptyObject);
});

it('should return an empty object if element node is a malformed object', () => {
  const rootNode = document.createElement('div');

  let result = getQueryAdvise({ rootNode, element: null });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode, element: '' });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode, element: {} });
  expect(result).toMatchInlineSnapshot(emptyObject);
});
