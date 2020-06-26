import React from 'react';
import { render, screen } from '@testing-library/react';
import cases from 'jest-in-case';
import Result from './Result';

cases(
  'should show image if elements is not an array or if is empty',
  (opts) => {
    const result = { error: '', expression: {}, elements: opts.elements };
    render(<Result result={result} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  },
  [
    { name: 'undefined', elements: undefined },
    { name: 'null', elements: null },
    { name: 'empty array', elements: [] },
  ],
);
