import React from 'react';
import { useCommonStore } from '@store/common';
import styled from 'styled-components';

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const [isSelectorModalUp, setIsSelectorModalUp] = useCommonStore((state) => [
    state.isSelectorModalUp,
    state.setIsSelectorModalUp,
  ]);

  return isSelectorModalUp ? (
    <Wrapper
      state={isSelectorModalUp}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setIsSelectorModalUp(false);
        }
      }}
    >
      {children}
    </Wrapper>
  ) : (
    <></>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  height: 100%;
  display: ${({ state }) => (state ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding-bottom: 50px;
  z-index: 999;
`;
