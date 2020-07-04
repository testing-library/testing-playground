import React from 'react';
import * as ReachMenu from '@reach/menu-button';

export const Menu = ReachMenu.Menu;

export const MenuButton = (props) => (
  <ReachMenu.MenuButton className="text-sm space-x-2 px-4" {...props} />
);

export const MenuPopover = (props) => (
  <ReachMenu.MenuPopover
    className="shadow text-sm rounded bg-white focus:outline-none py-2 px-4 py-2 text-sm"
    {...props}
  />
);

export const MenuList = (props) => (
  <ReachMenu.MenuList
    className="shadow rounded bg-white focus:outline-none py-2"
    {...props}
  />
);

export const MenuLink = (props) => (
  <ReachMenu.MenuLink
    as="a"
    className="hover:bg-blue-200 px-4 py-2 space-x-2 text-sm whitespace-no-wrap focus:outline-none flex justify-start w-full"
    {...props}
  />
);
