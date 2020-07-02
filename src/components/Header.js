import React from 'react';
import icon from 'url:~/public/36-production.png';
import { links } from '../constants';
import { Menu, MenuList, MenuButton, MenuLink, MenuPopover } from './Menu';
import { Modal, ModalContents, ModalOpenButton } from './Modal';

import {
  KebabHorizontalIcon,
  SettingsIcon,
  PaperAirplaneIcon,
  ShareAndroidIcon,
  FileCodeIcon,
  FileIcon,
  SyncIcon,
} from '@primer/octicons-react';
import Settings from './Settings';
import Share from './Share';
const headerLinks = [
  links.testing_library_docs,
  links.which_query,
  links.common_mistakes,
];

function Header({ status, settings, dispatch }) {
  return (
    <nav className="text-white w-full h-16">
      <div className="flex items-center justify-between bg-gray-900 px-8 h-16">
        <div className="flex items-center flex-shrink-0 text-white h-full space-x-8">
          <a className="title" href="/">
            <h1 className="font-light text-xl tracking-tight flex space-x-4 items-center justify-start">
              <img
                width={24}
                height={24}
                src={icon}
                alt="Testing Playground mascot Froggy"
              />
              ️ <span>Testing Playground</span>
            </h1>
          </a>
        </div>

        <div className="flex items-center text-sm h-full relative">
          <Menu>
            <MenuButton>
              <FileCodeIcon size={12} />
              <span>playground</span>
            </MenuButton>

            <MenuList>
              <MenuLink as="button" onClick={() => dispatch({ type: 'RESET' })}>
                <FileIcon size={12} />
                <span>New</span>
              </MenuLink>

              {/*reserved for future implementation*/}
              {/*<MenuLink as="button">*/}
              {/*  <UploadIcon size={12} />*/}
              {/*  <span>Save</span>*/}
              {/*</MenuLink>*/}

              {/*reserved for future implementation*/}
              {/*<MenuLink as="button">*/}
              {/*  <RepoForkedIcon size={12} />*/}
              {/*  <span>Fork</span>*/}
              {/*</MenuLink>*/}

              <div className="border-b border-gray-200 mx-4 my-2" />

              {/*reserved for future implementation, see #54 */}
              <Modal>
                <ModalOpenButton>
                  <MenuLink as="button">
                    <ShareAndroidIcon size={12} />
                    <span>Share</span>
                  </MenuLink>
                </ModalOpenButton>
                <ModalContents>
                  <Share />
                </ModalContents>
              </Modal>

              {/*reserved for future implementation, see #54 */}
              {/*reserved for future implementation*/}
              {/*<MenuLink as="button">*/}
              {/*  <CodeIcon size={12} />*/}
              {/*  <span>Embed</span>*/}
              {/*</MenuLink>*/}
            </MenuList>
          </Menu>

          <button
            className="space-x-4 px-4"
            onClick={() => {
              if (status === 'evaluating') {
                return;
              }

              dispatch({ type: 'EVALUATE' });
            }}
          >
            {status === 'evaluating' ? (
              <SyncIcon size={12} className="spinner" />
            ) : (
              <PaperAirplaneIcon size={12} />
            )}

            <span>run</span>
          </button>

          <Menu>
            <MenuButton>
              <SettingsIcon size={12} />
              <span>settings</span>
            </MenuButton>
            <MenuPopover>
              <Settings dispatch={dispatch} settings={settings} />
            </MenuPopover>
          </Menu>

          <Menu>
            <MenuButton>
              <span>
                <KebabHorizontalIcon
                  size={12}
                  className="transform rotate-90"
                />
              </span>
            </MenuButton>

            <MenuList>
              <MenuLink
                href="https://github.com/testing-library/testing-playground/projects/1"
                target="_blank"
              >
                Roadmap
              </MenuLink>
              <MenuLink
                href="https://github.com/testing-library/testing-playground/issues"
                target="_blank"
              >
                Issue tracker
              </MenuLink>
              <MenuLink
                href="https://github.com/sponsors/smeijer"
                target="_blank"
              >
                Support us
              </MenuLink>
              <MenuLink href="https://twitter.com/meijer_s" target="_blank">
                Twitter
              </MenuLink>

              <div className="border-b border-gray-200 mx-4 my-2" />

              {headerLinks.map((x) => (
                <MenuLink key={x.title} href={x.url} target="_blank">
                  {x.title}
                </MenuLink>
              ))}
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Header;
