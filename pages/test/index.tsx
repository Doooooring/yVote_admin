import Test1 from '@components/test/test1';
import Test2 from '@components/test/test2';

import styled from 'styled-components';

export default function Test() {
  return (
    <Wrapper>
      <Test1 />
      <Test2 />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
