import { useCallback, useState } from 'react';

export default function useObject<T>(obj: T) {
  const [v, setV] = useState<T>(obj);

  const setObject = useCallback(
    <K extends keyof T>(key: K, value: T[K]): void => {
      setV((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    },
    [setV, obj],
  );

  return [v, setObject];
}
