export const isArrIncludeSrc = <T>(arr: T[], s: T, compare: (a: T, b: T) => -1 | 0 | 1) => {
  return arr.filter((t) => compare(t, s) === 0).length > 0;
};
