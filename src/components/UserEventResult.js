import React from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

const UserEventResult = ({ eventExecuted, dispatch }) => {
  const handleToggleChange = () =>
    dispatch({
      type: 'TOGGLE_EXECUTION',
    });

  const label = eventExecuted
    ? 'showing the preview after user-event action is applied'
    : 'showing the preview according to the original markup';

  return (
    <div className="flex flex-col h-full">
      <div className="min-h-8 space-y-4 text-sm">
        <p>
          <a
            href="https://testing-library.com/docs/ecosystem-user-event"
            rel="noopener noreferrer"
            target="_blank"
            className="font-bold"
          >
            @testing-library/user-event
          </a>{' '}
          method detected!
        </p>
      </div>
      <div className="flex-auto flex items-center">
        <label className="w-full flex items-center justify-center">
          <div className="flex-auto flex justify-center">
            <Toggle
              onChange={handleToggleChange}
              defaultChecked={eventExecuted}
            />
          </div>
          <span className="min-h-8 space-y-4 text-sm flex-auto flex">
            {label}
          </span>
        </label>
      </div>
    </div>
  );
};

export default UserEventResult;
