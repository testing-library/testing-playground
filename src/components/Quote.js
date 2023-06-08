import React from 'react';

function Quote({ heading, content, source, href }) {
  return (
    <blockquote className="mb-4 w-full text-sm italic">
      <p className="mb-2 text-xs font-bold">{heading}:</p>
      <p>{content}</p>
      <cite>
        <a href={href}>{source}</a>
      </cite>
    </blockquote>
  );
}

export default Quote;
