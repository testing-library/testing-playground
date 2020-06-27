import React from 'react';
import CopyButton from './CopyButton';
import { render, fireEvent, act, waitFor } from '@testing-library/react';

const defaultProps = {
  text: 'string',
  title: 'title',
};

beforeEach(() => {
  delete window.navigator.clipboard;
  delete document.execCommand;
});

it('renders without crashing given default props', () => {
  render(<CopyButton {...defaultProps} />);
});

it('attempts to copy to clipboard through navigator.clipboard', async () => {
  const clipboardSpy = jest.fn();

  window.navigator.clipboard = {
    writeText: clipboardSpy,
  };

  const { getByRole } = render(<CopyButton {...defaultProps} />);

  await act(async () => {
    fireEvent.click(getByRole('button'));
  });

  expect(clipboardSpy).toHaveBeenCalledWith(defaultProps.text);
  expect(clipboardSpy).toHaveBeenCalledTimes(1);
});

it('attempts to copy with legacy methods if navigator.clipboard is unavailable', async () => {
  const execCommandSpy = jest.fn();

  document.execCommand = execCommandSpy;

  const { getByRole } = render(<CopyButton {...defaultProps} />);

  await act(async () => {
    fireEvent.click(getByRole('button'));
  });

  expect(execCommandSpy).toHaveBeenCalledWith('copy');
  expect(execCommandSpy).toHaveBeenCalledTimes(1);
});

it('temporarily shows a different icon after copying', async () => {
  jest.useFakeTimers();
  const execCommandSpy = jest.fn();

  document.execCommand = execCommandSpy;

  const { getByRole } = render(<CopyButton {...defaultProps} />);

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

it('should accept funcition to get text to copy', async () => {
  const execCommandSpy = jest.fn();
  const getTextToCopy = () => 'copy';

  document.execCommand = execCommandSpy;

  const { getByRole } = render(
    <CopyButton {...defaultProps} text={getTextToCopy} />,
  );

  await act(async () => {
    fireEvent.click(getByRole('button'));
  });

  expect(execCommandSpy).toHaveBeenCalledWith('copy');
  expect(execCommandSpy).toHaveBeenCalledTimes(1);
});
