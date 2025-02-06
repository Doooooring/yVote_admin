import styled, { keyframes } from 'styled-components';

export function SearchState({ searchErr, loading }: { searchErr: boolean; loading: boolean }) {
  return (
    <Indicator>
      <Indicate state={searchErr && !loading}>키워드 검색 에러. 다시 찾아봅시다</Indicate>
    </Indicator>
  );
}

const Indicator = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface IndicateProps {
  state: boolean;
}

const Indicate = styled.p<IndicateProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
`;

const rotate = keyframes`
0% {
  transform : rotate(0deg)
}
100% {
  transform : rotate(355deg)
}
`;

const Icon = styled.div`
  animation: ${rotate} 3s linear infinite;
`;
