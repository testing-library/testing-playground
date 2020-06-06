function deepEqual(left, right) {
  if (left === right) {
    return true;
  }

  if (Array.isArray(left)) {
    return (
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, idx) => deepEqual(value, right[idx]))
    );
  }

  if (typeof left === 'object') {
    return (
      typeof right === 'object' &&
      Object.keys(left).length === Object.keys(right).length &&
      Object.entries(left).every(([key, value]) => deepEqual(value, right[key]))
    );
  }

  if (left instanceof Date) {
    return right instanceof Date && left.getTime() === right.getTime();
  }

  return false;
}

export default deepEqual;
