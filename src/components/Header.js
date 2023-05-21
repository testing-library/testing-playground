import React from 'react';
import icon from '~/public/icons/36-production.png';
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
  UploadIcon,
  RepoForkedIcon,
  CodeIcon,
} from '@primer/octicons-react';
import Settings from './Settings';
import Share from './Share';
import Embed from './Embed';

const headerLinks = [
  links.testing_library_docs,
  links.which_query,
  links.common_mistakes,
];

const TwitterBird = () => (
  <svg
    className="w-4 h-4 group-hover:scale-110 duration-150 transform"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
  >
    <path fill="none" d="M0 0h72v72H0z" />
    <path
      className="icon"
      fill="#fff"
      d="M68.812 15.14c-2.348 1.04-4.87 1.744-7.52 2.06 2.704-1.62 4.78-4.186 5.757-7.243-2.53 1.5-5.33 2.592-8.314 3.176C56.35 10.59 52.948 9 49.182 9c-7.23 0-13.092 5.86-13.092 13.093 0 1.026.118 2.02.338 2.98C25.543 24.527 15.9 19.318 9.44 11.396c-1.125 1.936-1.77 4.184-1.77 6.58 0 4.543 2.312 8.552 5.824 10.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163 0 6.345 4.513 11.638 10.504 12.84-1.1.298-2.256.457-3.45.457-.845 0-1.666-.078-2.464-.23 1.667 5.2 6.5 8.985 12.23 9.09-4.482 3.51-10.13 5.605-16.26 5.605-1.055 0-2.096-.06-3.122-.184 5.794 3.717 12.676 5.882 20.067 5.882 24.083 0 37.25-19.95 37.25-37.25 0-.565-.013-1.133-.038-1.693 2.558-1.847 4.778-4.15 6.532-6.774z"
    />
  </svg>
);

function Header({
  gistId,
  gistVersion,
  status,
  dirty,
  canSave,
  canFork,
  settings,
  dispatch,
}) {
  return (
    <nav className="text-white w-full h-16">
      <div
        className="grid grid-cols-2 items-center bg-gray-900 px-8 h-16"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <div className="flex items-center justify-between flex-shrink-0 text-white h-full space-x-8 pr-4">
          <a className="title" href="/">
            <h1 className="font-light text-xl tracking-tight flex space-x-4 items-center justify-start">
              <img
                width={24}
                height={24}
                src={icon}
                alt="Testing Playground mascot Froggy"
              />
              ️ <span className="hidden md:block">Testing Playground</span>
            </h1>
          </a>

          <div className="flex items-center gap-2">
            <a
              className="rounded-md text-white group text-sm px-2 py-1 flex items-center space-x-2 no-underline"
              style={{ backgroundColor: '#1d9bf0' }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://go.meijer.ws/twitter"
            >
              <TwitterBird />
              <span>@meijer_s</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end text-sm h-full relative">
          <Menu>
            <MenuButton>
              {status === 'saving' ? (
                <SyncIcon size={12} className="spinner" />
              ) : (
                <FileCodeIcon size={12} />
              )}
              ️ <span className="hidden sm:block">Playground</span>
            </MenuButton>

            <MenuList>
              <MenuLink as="button" onClick={() => dispatch({ type: 'RESET' })}>
                <FileIcon size={12} />
                <span>New</span>
              </MenuLink>

              <MenuLink
                as="button"
                disabled={!canSave}
                onClick={() => dispatch({ type: 'SAVE' })}
              >
                <UploadIcon size={12} />
                <span>Save</span>
              </MenuLink>

              <MenuLink
                as="button"
                disabled={!canFork}
                onClick={() => dispatch({ type: 'FORK' })}
              >
                <RepoForkedIcon size={12} />
                <span>Fork</span>
              </MenuLink>

              <div className="border-b border-gray-200 mx-4 my-2" />

              <Modal>
                <ModalOpenButton>
                  <MenuLink as="button">
                    <ShareAndroidIcon size={12} />
                    <span>Share</span>
                  </MenuLink>
                </ModalOpenButton>
                <ModalContents>
                  <Share
                    dirty={dirty}
                    dispatch={dispatch}
                    gistId={gistId}
                    gistVersion={gistVersion}
                  />
                </ModalContents>
              </Modal>

              <Modal>
                <ModalOpenButton>
                  <MenuLink as="button">
                    <CodeIcon size={12} />
                    <span>Embed</span>
                  </MenuLink>
                </ModalOpenButton>
                <ModalContents>
                  <Embed
                    dirty={dirty}
                    dispatch={dispatch}
                    gistId={gistId}
                    gistVersion={gistVersion}
                  />
                </ModalContents>
              </Modal>
            </MenuList>
          </Menu>

          <button
            className="space-x-4 px-4"
            onClick={() => {
              if (status === 'evaluating') {
                return;
              }

              dispatch({ type: 'EVALUATE', immediate: true });
            }}
          >
            {status === 'evaluating' ? (
              <SyncIcon size={12} className="spinner" />
            ) : (
              <PaperAirplaneIcon size={12} />
            )}
            ️ <span className="hidden sm:block">Run</span>
          </button>

          <Menu>
            <MenuButton>
              <SettingsIcon size={12} />️{' '}
              <span className="hidden sm:block">Settings</span>
            </MenuButton>
            <MenuPopover>
              <Settings dispatch={dispatch} settings={settings} />
            </MenuPopover>
          </Menu>

          <Menu>
            <MenuButton title="more info">
              <span>
                <KebabHorizontalIcon
                  size={12}
                  className="transform rotate-90"
                />
              </span>
            </MenuButton>

            <MenuList>
              <MenuLink
                href="https://github.com/testing-library/testing-playground/issues"
                target="_blank"
              >
                GitHub
              </MenuLink>
              <MenuLink
                href="https://github.com/sponsors/smeijer"
                target="_blank"
              >
                Support Us
              </MenuLink>
              <MenuLink href="https://twitter.com/meijer_s" target="_blank">
                Twitter
              </MenuLink>

              <div className="border-b border-gray-200 mx-4 my-2" />

              <MenuLink
                href="https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano"
                target="_blank"
              >
                Chrome Extension
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
