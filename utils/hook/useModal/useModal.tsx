import { createContext, ReactNode, useContext } from 'react';

export interface ModalContextProp {
  show: (modal: ReactNode) => void;
  close: () => void;
}

export const ModalContext = createContext<ModalContextProp | null>(null);

export const useModal = () => {
  const { show, close } = useContext(ModalContext)!;
  return { show, close };
};
