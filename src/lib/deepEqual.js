function deepEqual(left, right) {
  if (left === right) {
    return true;
  }

  if (Array.isArray(left)) {
    return (
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, idx) => {
        return deepEqual(value, right[idx]);
      })
    );
  }

  if (left && typeof left === 'object') {
    return (
      right &&
      typeof right === 'object' &&
      Object.keys(left).length === Object.keys(right).length &&
      Object.entries(left).every(([key, value]) => {
        return deepEqual(value, right[key]);
      })
    );
  }

  if (left instanceof Date) {
    return right instanceof Date && left.getTime() === right.getTime();
  }

  return false;
}

export default deepEqual;
