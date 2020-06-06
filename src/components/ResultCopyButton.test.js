import React from 'react';
import ResultCopyButton from './ResultCopyButton';
import { render, fireEvent, act, waitFor } from '@testing-library/react';

const defaultProps = {
  expression: 'string',
};

describe('<ResultCopyButton />', () => {
  it('renders without crashing given default props', () => {
    render(<ResultCopyButton {...defaultProps} />);
  });

  it('attempts to copy to clipboard through navigator.clipboard', async () => {
    const clipboardSpy = jest.fn();

    window.navigator.clipboard = {
      writeText: clipboardSpy,
    };

    const { getByRole } = render(<ResultCopyButton {...defaultProps} />);

    await act(async () => {
      fireEvent.click(getByRole('button'));
    });

    expect(clipboardSpy).toHaveBeenCalledWith(defaultProps.expression);
    expect(clipboardSpy).toHaveBeenCalledTimes(1);

    delete window.navigator.clipboard;
  });

  it('attempts to copy with legacy methods if navigator.clipboard is unavailable', async () => {
    const execCommandSpy = jest.fn();

    document.execCommand = execCommandSpy;

    const { getByRole } = render(<ResultCopyButton {...defaultProps} />);

    await act(async () => {
      fireEvent.click(getByRole('button'));
    });

    expect(execCommandSpy).toHaveBeenCalledWith('copy');
    expect(execCommandSpy).toHaveBeenCalledTimes(1);
  });

  it('temporarily shows a different icon after copying', async () => {
    jest.useFakeTimers();

    const { getByRole } = render(<ResultCopyButton {...defaultProps} />);

    const button = getByRole('button');

    const initialIcon = button.innerHTML;

    // act due to useEffect state change
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button.innerHTML).not.toBe(initialIcon);
    });

    // same here
    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(button.innerHTML).toBe(initialIcon);
    });
  });
});
