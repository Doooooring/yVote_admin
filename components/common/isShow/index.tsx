import { ReactNode } from 'react';

interface IsShowProps {
  state: boolean;
  children: ReactNode;
}

export default function IsShow({ state, children }: IsShowProps) {
  return state ? <>{children}</> : <></>;
}
