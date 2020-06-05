import React, { useState, useEffect } from 'react';

/**
 *
 * @param {string} suggestion
 */
async function attemptCopyToClipboard(suggestion) {
  try {
    if ('clipboard' in navigator) {
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

const SuccessIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width="18"
    height="18"
    viewBox="0 0 512 512"
  >
    <path d="M256 8a248 248 0 100 496 248 248 0 000-496zm0 48a200 200 0 110 400 200 200 0 010-400m140 130l-22-22c-5-5-13-5-17-1L215 304l-59-61c-5-4-13-4-17 0l-23 23c-5 5-5 12 0 17l91 91c4 5 12 5 17 0l172-171c5-4 5-12 0-17z" />
  </svg>
);

const CopyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path
      fill="currentColor"
      d="
M3 13h2v-2H3v2zm0 4h2v-2H3v2zm2 4v-2H3a2 2 0 0 0 2 2zM3 9h2V7H3v2zm12 12h2v-2h-2v2zm4-18H9a2 2 0 0 0-2
2v10a2 2 0 0 0 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H9V5h10v10zm-8 6h2v-2h-2v2zm-4 0h2v-2H7v2z
"
    ></path>
  </svg>
);

/**
 *
 * @param {{
 * expression: string;
 * }} props
 */
function ResultCopyButton({ expression }) {
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
    const wasSuccessfullyCopied = await attemptCopyToClipboard(expression);

    if (wasSuccessfullyCopied) {
      setCopied(true);
    }
  }

  return (
    <button
      type="button"
      className="focus:outline-none"
      onClick={copied ? undefined : handleClick}
      title="copy query"
    >
      {copied ? SuccessIcon : CopyIcon}
    </button>
  );
}

export default ResultCopyButton;
