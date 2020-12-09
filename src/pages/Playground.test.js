import React from 'react';
import { render } from '@testing-library/react';
import Playground from '../App';

describe('App', () => {
  it('should not throw on render', () => {
    render(<Playground />);
  });
});
