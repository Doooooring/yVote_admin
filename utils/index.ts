export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function changeItemsOrder(target: Array<any>, before: number, after: number) {
  const newTarget = clone(target);

  const curBefore = clone(target[before]);
  const curAfter = clone(target[after]);

  newTarget[before] = curAfter;
  newTarget[after] = curBefore;
  return newTarget;
}
