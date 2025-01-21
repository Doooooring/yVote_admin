import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useStateDepend = <T extends {}>(depend: T) => {
  const [state, setState] = useState<T>(depend);
  useEffect(() => {
    setState(depend);
  }, [setState, depend]);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
};
