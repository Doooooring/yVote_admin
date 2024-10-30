import { ReactNode } from 'react';
import styled from 'styled-components';

interface ModalProps {
  children: ReactNode;
  state: boolean;
  outClickAction?: () => any;
  backgroundColor?: string;
}

export default function CommonModal({
  children,
  state,
  outClickAction,
  backgroundColor = 'rgba(0,0,0,0.5)',
}: ModalProps) {
  if (!state) return <></>;

  return (
    <Wrapper
      onClick={(e) => {
        if (e.target === e.currentTarget && outClickAction) {
          outClickAction();
        }
      }}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 9999;
  /* display: flex;
  flex-direction: row;
  justify-content: center; */
`;
