import React from 'react';
import { Dialog } from '@reach/dialog';
import { XIcon } from '@primer/octicons-react';
import IconButton from './IconButton';

const callAll = (...fns) => (...args) => fns.forEach((fn) => fn && fn(...args));

const ModalContext = React.createContext();

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
}

function ModalDismissButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  });
}

function ModalOpenButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  });
}

function ModalContentsBase(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext);
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  );
}

function ModalContents({ title, children, ...props }) {
  return (
    <ModalContentsBase
      className="rounded shadow p-4"
      aria-label={title || '-'}
      {...props}
    >
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">{title}</h3>

          <ModalDismissButton>
            <IconButton>
              <XIcon />
            </IconButton>
          </ModalDismissButton>
        </div>
      )}

      {children}
    </ModalContentsBase>
  );
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents };
