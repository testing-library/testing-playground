import React from 'react';

const UserEventResult = () => {
  return (
    <div className="space-y-4 text-sm">
      <div className="min-h-8">
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
    </div>
  );
};

export default UserEventResult;
