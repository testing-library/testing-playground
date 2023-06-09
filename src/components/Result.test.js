import React from 'react';
import { render, screen } from '@testing-library/react';
import Result from './Result';

describe('should show image if elements is not an array or if is empty', () => {
  it.each([
    { name: 'undefined', elements: undefined },
    { name: 'null', elements: null },
    { name: 'empty array', elements: [] },
  ])('$name', (opts) => {
    const result = { error: '', expression: {}, elements: opts.elements };
    render(<Result result={result} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
