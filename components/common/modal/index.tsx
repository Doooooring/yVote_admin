import { useCommonStore } from '@store/common';
import styled from 'styled-components';

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const [isModalUp, setIsModalUp] = useCommonStore((state) => [
    state.isModalUp,
    state.setIsModalup,
  ]);

  return (
    <Wrapper
      state={isModalUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsModalUp(false);
        }
      }}
    >
      {children}
    </Wrapper>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  backdrop-filter: blur(2px);
  z-index: 999;
`;
