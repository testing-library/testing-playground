import React, { useState } from 'react';
import Input from './Input';
import CopyButton from './CopyButton';
import Embedded from './Embedded';
import { XIcon } from '@primer/octicons-react';

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

function Embed({ dirty, gistId, gistVersion }) {
  const [panes, setPanes] = useState(['preview', 'result']);

  const width = 850;
  const height = 300;

  const embedUrl =
    [location.origin, 'embed', gistId, gistVersion].filter(Boolean).join('/') +
    `?panes=${panes.join(',')}`;

  const embedCode = `<iframe src="${embedUrl}" height="${height}" width="100%" scrolling="no" frameBorder="0" allowTransparency="true" title="Testing Playground" style="overflow: hidden; display: block; width: 100%"></iframe>`;
  const canAddPane = panes.length < 3;

  return (
    <div className="settings text-sm pb-2">
      <div className="space-y-6">
        {dirty && (
          <section className="bg-blue-100 p-2 text-xs rounded my-2 text-blue-800">
            Please note that this playground has
            <strong> unsaved changes </strong>. The embed
            <strong> will not include </strong> your latest changes!
          </section>
        )}

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

            <div style={{ width, height }}>
              <Embedded
                panes={panes}
                gistId={gistId}
                gistVersion={gistVersion}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-4" style={{ width }}>
          <h3 className="text-sm font-bold">Copy & Paste</h3>

          <label className="text-xs">
            embed link:
            <div className="flex space-x-4">
              <Input value={embedUrl} onChange={() => {}} readOnly name="url" />
              <CopyButton text={embedUrl} />
            </div>
          </label>

          <label className="text-xs">
            embed code:
            <div className="w-full flex space-x-4">
              <code className="p-4 rounded bg-gray-200 text-gray-800 font-mono text-xs">
                {embedCode}
              </code>
              <CopyButton text={embedCode} />
            </div>
          </label>
        </section>
      </div>
    </div>
  );
}

export default Embed;
