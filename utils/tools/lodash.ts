type commFunc = <T>(...args: T[]) => any;

export const throttle = <T>(cb: (...args: T[]) => any, sec: number) => {
  let callback: ((...args: T[]) => any) | null = null;
  let timer: NodeJS.Timeout | null = null;
  return (...arg: T[]) => {
    callback = cb;
    if (!timer) {
      timer = setTimeout(() => {
        callback!(...arg);
        timer = null;
      }, sec);
    }
  };
};

export const debounce = <T>(cb: (...args: T[]) => any, sec: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...arg: T[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      cb(...arg);
    }, sec);
  };
};
