import { getData } from './queryAdvise';
import { renderIntoDocument } from '../../tests/utils/dom-render';

describe('queryAdvise', () => {
  describe('getData', () => {
    it('should not thrown if id attribute of DOM element is invalid', () => {
      const container = renderIntoDocument('<button id= name="submit" />');
      getData({ root: container, element: container.querySelector('button') });
    });
  });
});
