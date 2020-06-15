import React from 'react';

function Footer() {
  return (
    <div className="footer flex justify-between items-center py-4 px-8">
      <div className="text-xs text-gray-800">
        Copyright © 2020 Stephan Meijer & Contributors
      </div>
      <div className="flex space-x-4 items-center">
        <a
          className="github-button"
          href="https://github.com/sponsors/smeijer"
          data-icon="octicon-heart"
          aria-label="Sponsor @smeijer on GitHub"
        >
          Sponsor
        </a>
        <a href="https://twitter.com/meijer_s">
          <img
            alt="Follow me on Twitter"
            src="https://img.shields.io/twitter/url?label=@meijer_s&style=social&url=https%3A%2F%2Ftwitter.com%2Fmeijer_s"
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
