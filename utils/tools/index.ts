export const htmlFromString = (s: string) => {
  if (window === undefined) return s;
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, 'text/html');
  return doc.body;
};

export const sortKorCallback = (a: string, b: string) => {
  return a > b ? 1 : a < b ? -1 : 0;
};

export const throttle = <T>(cb: (...args: T[]) => any, sec: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...arg: T[]) => {
    if (timer) return;
    timer = setTimeout(() => {
      cb(...arg);
      timer = null;
    }, sec);
  };
};

type commFunc = <T>(...args: T[]) => any;

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
