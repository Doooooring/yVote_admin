import { ReactNode, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from './useModal';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<ReactNode | null>(null);

  const show = useCallback(
    (modal: ReactNode) => {
      setModal(modal);
      setIsModalOpen(true);
    },
    [setModal, setIsModalOpen],
  );

  const close = useCallback(() => {
    setModal(null);
    setIsModalOpen(false);
  }, [setModal, setIsModalOpen]);

  return (
    <ModalContext.Provider value={{ show, close }}>
      {children}
      {isModalOpen && createPortal(modal, document.getElementById('portal-root') as HTMLElement)}
    </ModalContext.Provider>
  );
}
