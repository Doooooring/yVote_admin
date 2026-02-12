export const htmlFromString = (s: string) => {
  if (window === undefined) return s;
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, 'text/html');
  return doc.body;
};

export const getDotDateForm = (date: Date) => {
  if (typeof date === 'string') date = new Date(date);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const getStandardDateForm = (date: Date | string) => {
  if (typeof date === 'string') {
    // If it's an ISO string, parse it
    const parsed = new Date(date);
    if (!isNaN(parsed.valueOf())) {
      date = parsed;
    } else {
      // If it's already YYYY-MM-DD, return as is
      return date;
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const base64Map = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z',
  26: 'a',
  27: 'b',
  28: 'c',
  29: 'd',
  30: 'e',
  31: 'f',
  32: 'g',
  33: 'h',
  34: 'i',
  35: 'j',
  36: 'k',
  37: 'l',
  38: 'm',
  39: 'n',
  40: 'o',
  41: 'p',
  42: 'q',
  43: 'r',
  44: 's',
  45: 't',
  46: 'u',
  47: 'v',
  48: 'w',
  49: 'x',
  50: 'y',
  51: 'z',
  52: '0',
  53: '1',
  54: '2',
  55: '3',
  56: '4',
  57: '5',
  58: '6',
  59: '7',
  60: '8',
  61: '9',
  62: '+',
  63: '/',
};
