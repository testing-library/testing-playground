import React from 'react';
import icon from 'url:~/public/36-production.png';
import { links } from '../constants';

const headerLinks = [
  links.testing_library_docs,
  links.which_query,
  links.common_mistakes,
];

function Header() {
  return (
    <nav className="text-white w-full h-20 md:h-16">
      <div className="flex items-center justify-between bg-gray-900 px-8 h-10 md:h-16">
        <div className="flex items-center flex-shrink-0 text-white">
          <a className="title" href="/">
            <h1 className="font-light text-xl tracking-tight flex space-x-4 items-center justify-start">
              <img width={24} height={24} src={icon} />️{' '}
              <span>Testing Playground</span>
            </h1>
          </a>
        </div>

        <div className="flex items-center space-x-8">
          <a
            href="https://github.com/smeijer/testing-playground"
            className="hover:underline"
          >
            GitHub
          </a>

          <div className="border-r border-gray-600 mx-4 h-8 hidden md:block" />

          {headerLinks.map((x) => (
            <a
              className="hover:underline hidden md:block"
              key={x.title}
              href={x.url}
            >
              {x.title}
            </a>
          ))}
        </div>
      </div>

      <div className="flex justify-between sm:justify-end items-center bg-gray-800 px-8 h-10 md:hidden space-x-8">
        {headerLinks.map((x) => (
          <a className="hover:underline truncate" key={x.title} href={x.url}>
            {x.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Header;
