import React from 'react';
import App from './App';
import { renderWithContext } from '../../tests/utils/render';

describe('App', () => {
  it('should not throw on render', () => {
    renderWithContext(<App />);
  });
});
