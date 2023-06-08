import React from 'react';
import * as ReachMenu from '@reach/menu-button';

export const Menu = ReachMenu.Menu;

export const MenuButton = (props) => (
  <ReachMenu.MenuButton className="space-x-2 px-4 text-sm" {...props} />
);

export const MenuPopover = (props) => (
  <ReachMenu.MenuPopover
    className="shadow rounded focus:outline-none bg-white px-4 py-2 py-2 text-sm text-sm"
    {...props}
  />
);

export const MenuList = (props) => (
  <ReachMenu.MenuList
    className="shadow rounded focus:outline-none bg-white py-2"
    {...props}
  />
);

export const MenuLink = (props) => (
  <ReachMenu.MenuLink
    as="a"
    className="whitespace-no-wrap focus:outline-none flex w-full justify-start space-x-2 px-4 py-2 text-sm hover:bg-blue-200"
    {...props}
  />
);
