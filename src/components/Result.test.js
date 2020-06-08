import React from 'react';
import { render, screen } from '@testing-library/react';
import cases from 'jest-in-case';
import Result from './Result';

cases(
  'should show "I don\'t know" if elements is not an array or if is empty',
  (opts) => {
    render(
      <Result
        result={{ error: '', expression: {}, elements: opts.elements }}
      />,
    );
    expect(
      screen.getByText(/I don't know what to say/, { exact: false }),
    ).toBeInTheDocument();
  },
  [
    {
      name: 'unedfined',
      elements: undefined,
    },
    {
      name: 'null',
      elements: null,
    },
    {
      name: 'empty array',
      elements: [],
    },
  ],
);
