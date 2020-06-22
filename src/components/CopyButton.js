/* global chrome */
import React, { useState, useEffect } from 'react';
import IconButton from './IconButton';
import { CopyIcon, CheckIcon } from '@primer/octicons-react';

const IS_DEVTOOL = !!(window.chrome && chrome.runtime && chrome.runtime.id);

/**
 *
 * @param {string} suggestion
 */
async function attemptCopyToClipboard(suggestion) {
  try {
    if (!IS_DEVTOOL && 'clipboard' in navigator) {
      await navigator.clipboard.writeText(suggestion);
      return true;
    }

    const input = Object.assign(document.createElement('input'), {
      type: 'text',
      value: suggestion,
    });

    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 *
 * @param {{
 * text: string | function;
 * title: string;
 * className: string;
 * variant: string;
 * }} props
 */
function CopyButton({ text, title, className, variant }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  async function handleClick() {
    let textToCopy = text;
    if (typeof text === 'function') {
      textToCopy = text();
    }
    const wasSuccessfullyCopied = await attemptCopyToClipboard(textToCopy);

    if (wasSuccessfullyCopied) {
      setCopied(true);
    }
  }

  return (
    <IconButton
      variant={variant}
      onClick={copied ? undefined : handleClick}
      title={title}
      className={className}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </IconButton>
  );
}

export default CopyButton;
