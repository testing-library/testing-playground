import React from 'react';
import icon from '../../public/favicon-32x32.png';
import { links } from '../constants';

const headerLinks = [
  links.testing_library_docs,
  links.which_query,
  links.common_mistakes,
];

function Header() {
  return (
    <div className="w-100 h-16">
      <nav className="flex items-center justify-between bg-gray-900 h-16 px-8 text-white fixed z-10 top-0 w-full">
        <div className="flex items-center flex-shrink-0 text-white">
          <a href="/">
            <h1 className="font-light text-xl tracking-tight flex space-x-4 items-center justify-start">
              <img width={24} height={24} src={icon} />️{' '}
              <span>Testing Playground</span>
            </h1>
          </a>
        </div>

        <div>
          <a
            href="https://github.com/smeijer/testing-playground"
            className="hover:underline"
            target="_blank"
          >
            GitHub
          </a>
        </div>

        <div className="flex space-x-8">
          {headerLinks.map((x) => (
            <a
              className="hover:underline"
              key={x.title}
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {x.title}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Header;
