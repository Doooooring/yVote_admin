import { ReactNode } from 'react';
import { useProtected } from './protected.hook';

interface ProtectedProps {
  children: ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isValid = useProtected();

  console.log('isValid : ', isValid);

  return isValid ? <>{children}</> : <></>;
}
