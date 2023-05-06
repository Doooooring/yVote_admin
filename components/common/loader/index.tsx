import styled from 'styled-components';

import { useCommonStore } from '@store/common';

export default function Loader() {
  const isLoading = useCommonStore((state) => state.isLoading);
  return <Wrapper state={isLoading}></Wrapper>;
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 999;
`;
