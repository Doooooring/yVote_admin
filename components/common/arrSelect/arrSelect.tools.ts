export const isArrIncludeSrc = <T>(arr: T[], s: T, compare: (a: T, b: T) => -1 | 0 | 1) => {
  return (
    arr.filter((t) => {
      return compare(s, t) === 0;
    }).length > 0
  );
};
