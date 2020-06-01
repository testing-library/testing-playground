import React from 'react';
import { render } from '@testing-library/react';
import { PlaygroundProvider } from '../../src/components/Context';

function renderIntoContext(component, ...args) {
  return render(<PlaygroundProvider>{component}</PlaygroundProvider>, ...args);
}

export { renderIntoContext };
