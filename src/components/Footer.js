import React from 'react';

function Footer() {
  return (
    <div className="footer flex justify-between items-center py-4 px-8">
      <div className="text-xs text-gray-800">
        Copyright © 2020 Stephan Meijer & Contributors
      </div>

      <div className="flex space-x-4 items-center">
        <a href="https://twitter.com/TestingLib">
          <img
            alt="Follow us on Twitter"
            src="https://img.shields.io/twitter/url?label=Follow&style=social&url=https://twitter.com/TestingLib"
          />
        </a>

        <a
          className="github-button"
          href="https://github.com/testing-library/testing-playground/issues"
          data-icon="octicon-issue-opened"
          aria-label="Issue testing-library/testing-playground on GitHub"
        >
          Issue
        </a>

        <a
          className="github-button"
          href="https://github.com/testing-library/testing-playground"
          data-icon="octicon-star"
          aria-label="Star testing-library/testing-playground on GitHub"
        >
          Star
        </a>

        <a
          className="github-button"
          href="https://github.com/testing-library/testing-playground/fork"
          data-icon="octicon-repo-forked"
          aria-label="Fork testing-library/testing-playground on GitHub"
        >
          Fork
        </a>
      </div>
    </div>
  );
}

export default React.memo(Footer);
