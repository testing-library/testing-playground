import React from 'react';

function Quote({ heading, content, source, href }) {
  return (
    <blockquote className="text-sm mb-4 italic w-full">
      <p className="font-bold text-xs mb-2">{heading}:</p>
      <p>{content}</p>
      <cite>
        <a href={href}>{source}</a>
      </cite>
    </blockquote>
  );
}

export default Quote;
