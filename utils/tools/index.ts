export const htmlFromString = (s: string) => {
  if (window === undefined) return s;
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, 'text/html');
  return doc.body;
};

export const sortKorCallback = (a: string, b: string) => {
  return a > b ? 1 : a < b ? -1 : 0;
};
