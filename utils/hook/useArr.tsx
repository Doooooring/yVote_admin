import { changeItemsOrder, complexClone } from '@utils';
import { useState } from 'react';

export const useArr = <T,>(arr: T[], setArr: (arr: T[]) => void, getInitialValue: () => T) => {
  const [curFocus, setCurFocus] = useState<number | null>(null);

  const addArr = (idx: number) => {
    const curArr = complexClone(arr);
    const newData = getInitialValue();
    curArr.splice(idx + 1, 0, newData);
    setArr(curArr);
  };

  const deleteArr = (idx: number) => {
    const curArr = complexClone(arr);
    curArr.splice(idx, 1);
    setArr(curArr);
    setCurFocus(null);
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
