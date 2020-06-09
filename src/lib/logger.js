import differ from 'deep-diff';

const styles = {
  header: 'color: gray; font-weight: lighter;',
  type: 'color: black; font-weight: bold;',
  prevState: 'color: #9E9E9E; font-weight: bold;',
  action: 'color: #03A9F4; font-weight: bold;',
  nextState: 'color: #4CAF50; font-weight: bold;',
  error: 'color: #F20404; font-weight: bold;',
  black: 'color: #000000; font-weight: bold;',

  diff: {
    E: {
      style: `color: #2196F3; font-weight: bold`,
      text: 'CHANGED:',
    },
    N: {
      style: `color: #4CAF50; font-weight: bold`,
      text: 'ADDED:',
    },
    D: {
      style: `color: #F44336; font-weight: bold`,
      text: 'DELETED:',
    },
    A: {
      style: `color: #2196F3; font-weight: bold`,
      text: 'ARRAY:',
    },
  },
};

export const pad = (num, maxLength) => `${num}`.padStart(0, maxLength);

function formatTime(time) {
  return `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(
    time.getSeconds(),
    2,
  )}.${pad(time.getMilliseconds(), 3)}`;
}

// Use performance API if it's available in order to get better precision
//   performance can be null, performance?.now won't work here!
const timer =
  (typeof performance || {}).now === 'function' ? performance : Date;

function renderDiff(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case 'E':
      return [path.join('.'), lhs, '→', rhs];
    case 'N':
      return [path.join('.'), rhs];
    case 'D':
      return [path.join('.')];
    case 'A':
      return [`${path.join('.')}[${index}]`, item];
    default:
      return [];
  }
}

const isLoggingEnabled =
  process.env.NODE_ENV !== 'production' || !!localStorage.getItem('debug');

export function withLogging(reducerFn) {
  if (isLoggingEnabled) {
    return reducerFn;
  }

  const supportsGroups = typeof console.groupCollapsed === 'function';

  return (prevState, action) => {
    const started = timer.now();
    const startedTime = new Date();

    const newState = reducerFn(prevState, action);

    const took = timer.now() - started;
    const diff = differ(prevState, newState);

    const header = [
      [
        `%caction`,
        `%c${action.type}`,
        `%c@ ${formatTime(startedTime)}`,
        `(in ${took.toFixed(2)} ms)`,
      ].join(' '),
      styles.header,
      styles.type,
      styles.header,
    ];

    if (supportsGroups) {
      console.group(...header);
    } else {
      console.log(...header);
    }

    console.log('%c prev state %O', styles.prevState, prevState);
    console.log('%c action     %O', styles.action, action);
    console.log('%c new state  %O', styles.nextState, newState);

    if (!diff) {
      console.log(
        '%c diff       %cno state change!',
        styles.prevState,
        styles.error,
      );
    } else {
      if (supportsGroups) {
        console.groupCollapsed(' diff');
      } else {
        console.log('diff');
      }

      diff.forEach((elem) => {
        console.log(
          `%c ${styles.diff[elem.kind].text}`,
          styles.diff[elem.kind].style,
          ...renderDiff(elem),
        );
      });

      if (supportsGroups) {
        console.groupEnd();
      }
    }

    if (supportsGroups) {
      console.groupEnd();
    }

    return newState;
  };
}
