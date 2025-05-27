import { changeItemsOrder, complexClone } from '@utils';
import { useState } from 'react';

export const useArr = <T,>(
  arr: T[],
  setArr: (arr: T[]) => void,
  getInitialValue: () => T | null,
  defaultSelected: number | null = null,
) => {
  const [curFocus, setCurFocus] = useState<number | null>(defaultSelected);

  const addArr = (idx: number, target: Partial<T> | null = null) => {
    const curArr = complexClone(arr);
    const newData = getInitialValue();
    if (!newData) return;
    if (target) {
      Object.assign(newData, target);
    }
    curArr.splice(idx + 1, 0, newData);
    setArr(curArr);
  };

  const deleteArr = (idx: number) => {
    const curArr = complexClone(arr);
    curArr.splice(idx, 1);
    setArr(curArr);
    setCurFocus(defaultSelected);
  };

  const moveArrLeft = (idx: number) => {
    if (idx === 0) return;

    const newArr = changeItemsOrder(arr, idx, idx - 1);
    setArr(newArr);
    setCurFocus(curFocus! - 1);
  };

  const moveArrRight = (idx: number) => {
    if (idx === arr.length - 1) return;

    const newTimline = changeItemsOrder(arr, idx, idx + 1);
    setArr(newTimline);
    setCurFocus(curFocus! + 1);
  };

  return {
    curFocus,
    setCurFocus,
    addArr,
    deleteArr,
    moveArrLeft,
    moveArrRight,
  };
};
