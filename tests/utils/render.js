import React from 'react';
import { render } from '@testing-library/react';
import { AppContextProvider } from '../../src/components/Context';

function renderWithContext(component, ...args) {
  return render(<AppContextProvider>{component}</AppContextProvider>, ...args);
}

export { renderWithContext };
