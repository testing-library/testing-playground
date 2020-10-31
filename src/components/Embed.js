import React, { useEffect, useState } from 'react';
import Input from './Input';
import CopyButton from './CopyButton';
import Embedded from './Embedded';
import { SyncIcon, XIcon } from '@primer/octicons-react';

import { defaultPanes } from '../constants';

function TabButton({ children, active, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      className={[
        'text-xs select-none border-b-2',
        disabled ? '' : 'hover:text-blue-400 hover:border-blue-400',
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-800',
      ].join(' ')}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}

const possiblePanes = ['markup', 'preview', 'query', 'result'];

const styles = {
  section: { width: 850 },
  frame: { width: 850, height: 375 },
};

// TODO: make the preview frame height match the end result, and let
//  the user modify the frame height
function Embed({ dispatch, dirty, gistId, gistVersion }) {
  useEffect(() => {
    if (!dirty) {
      return;
    }

    dispatch({ type: 'SAVE' });
  }, [dirty, gistId, dispatch]);

  const [panes, setPanes] = useState(defaultPanes);

  const embedUrl =
    [location.origin, 'embed', gistId, gistVersion].filter(Boolean).join('/') +
    `?panes=${panes.join(',')}`;

  const embedCode = `<iframe src="${embedUrl}" height="450" width="100%" scrolling="no" frameBorder="0" allowTransparency="true" title="Testing Playground" style="overflow: hidden; display: block; width: 100%"></iframe>`;
  const canAddPane = panes.length < 3;

  const loader = (
    <div className="flex space-x-4 items-center border rounded w-full py-2 px-3 bg-white text-gray-800 leading-tight">
      <SyncIcon size={12} className="spinner" />
      <span>one sec...</span>
    </div>
  );

  return (
    <div className="settings text-sm pb-2">
      <div className="space-y-6">
        <section className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Configure</h3>
            <TabButton
              onClick={() =>
                setPanes([
                  ...panes,
                  possiblePanes.find((x) => !panes.includes(x)),
                ])
              }
              disabled={!canAddPane}
            >
              add pane
            </TabButton>
          </div>

          {/* overflow-hidden is required hide the hidden preview panel */}
          <div className="bg-gray-200 px-4 pb-4 -mx-4 overflow-hidden">
            <div className="px-4 gap-4 grid grid-flow-col py-1">
              {panes.map((selected, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="text-left space-x-2">
                    {possiblePanes.map((name) => (
                      <TabButton
                        key={name}
                        onClick={() =>
                          setPanes((current) => {
                            const next = [...current];
                            next[idx] = name;
                            return next;
                          })
                        }
                        active={selected === name}
                      >
                        {name}
                      </TabButton>
                    ))}
                  </div>
                  <TabButton
                    disabled={panes.length === 1}
                    onClick={() => setPanes(panes.filter((_, i) => i !== idx))}
                  >
                    <span>
                      <XIcon size={12} />
                    </span>
                  </TabButton>
                </div>
              ))}
            </div>

            <div style={styles.frame}>
              {dirty ? null : (
                <Embedded
                  panes={panes}
                  gistId={gistId}
                  gistVersion={gistVersion}
                  height={styles.frame.height}
                />
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-4" style={styles.section}>
          <h3 className="text-sm font-bold">Copy & Paste</h3>

          <label className="text-xs">
            embed link:
            {dirty ? (
              loader
            ) : (
              <div className="flex space-x-4">
                <Input
                  value={embedUrl}
                  onChange={() => {}}
                  readOnly
                  name="url"
                />
                <CopyButton text={embedUrl} />
              </div>
            )}
          </label>

          <label className="text-xs">
            embed code:
            {dirty ? (
              loader
            ) : (
              <div className="w-full flex space-x-4">
                <code className="p-4 rounded bg-gray-200 text-gray-800 font-mono text-xs">
                  {embedCode}
                </code>
                <CopyButton text={embedCode} />
              </div>
            )}
          </label>
        </section>
      </div>
    </div>
  );
}

export default Embed;
