import React, { useEffect, useState } from 'react';
import Input from './Input';
import CopyButton from './CopyButton';
import Embedded from '../pages/Embedded';
import { SyncIcon, XIcon } from '@primer/octicons-react';

import { defaultPanes } from '../constants';
import TabButton from './TabButton';

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
    <div className="border rounded flex w-full items-center space-x-4 bg-white px-3 py-2 leading-tight text-gray-800">
      <SyncIcon size={12} className="spinner" />
      <span>one sec...</span>
    </div>
  );

  return (
    <div className="settings pb-2 text-sm">
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
          <div className="-mx-4 overflow-hidden bg-gray-200 px-4 pb-4">
            <div className="grid grid-flow-col gap-4 px-4 py-1">
              {panes.map((selected, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="space-x-2 text-left">
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
              <div className="flex w-full space-x-4">
                <code className="rounded bg-gray-200 p-4 font-mono text-xs text-gray-800">
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
