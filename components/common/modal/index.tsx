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
  width: 100%;
  height: 100vh;
  display: ${({ state }) => (state ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
  padding-bottom: 50px;
  z-index: 999;
`;
