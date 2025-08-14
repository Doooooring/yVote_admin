import { MouseEvent, PropsWithChildren, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface CommonModalLayoutInterface extends PropsWithChildren {
  onOutClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}

export function CommonModalLayout({
  onOutClick: onOutClickUser = () => {},
  children,
}: CommonModalLayoutInterface) {
  const onOutClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOutClickUser(e);
      }
    },
    [onOutClickUser],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return <CommonModalBackground onClick={onOutClick}>{children}</CommonModalBackground>;
}

export const CommonModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 9999;
  overscroll-behavior: none;
  overscroll-behavior: contain;
`;
