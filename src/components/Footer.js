import React from 'react';

function Footer() {
  return (
    <div className="footer flex justify-between">
      <div className="text-sm text-gray-800">
        Copyright © 2020 S. Meijer and contributors
      </div>
      <div className="flex space-x-4">
        <a
          className="github-button"
          href="https://github.com/sponsors/smeijer"
          data-icon="octicon-heart"
          aria-label="Sponsor @smeijer on GitHub"
        >
          Sponsor
        </a>
        <a target="_blank" href="https://twitter.com/meijer_s">
          <img
            alt="Follow me on Twitter"
            src="https://img.shields.io/twitter/url?label=Follow&style=social&url=https%3A%2F%2Ftwitter.com%2Fmeijer_s"
          />
        </a>

        <a
          className="github-button"
          href="https://github.com/smeijer/testing-playground/issues"
          data-icon="octicon-issue-opened"
          aria-label="Issue smeijer/testing-playground on GitHub"
        >
          Issue
        </a>

        <a
          className="github-button"
          href="https://github.com/smeijer/testing-playground"
          data-icon="octicon-star"
          data-show-count="true"
          aria-label="Star smeijer/testing-playground on GitHub"
        >
          Star
        </a>

        <a
          className="github-button"
          href="https://github.com/smeijer/testing-playground/fork"
          data-icon="octicon-repo-forked"
          aria-label="Fork smeijer/testing-playground on GitHub"
        >
          Fork
        </a>
      </div>
    </div>
  );
}

export default React.memo(Footer);
