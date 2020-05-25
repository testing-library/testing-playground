import React from 'react';
import App from './App';
import { renderIntoContext } from '../../tests/utils/react-render';

describe('App', () => {
  it('should not throw on render', () => {
    renderIntoContext(<App />);
  });
});
