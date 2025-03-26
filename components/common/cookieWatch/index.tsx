import { CommonLayoutBox } from '@components/common/figure';
import { Suspense } from 'react';
import styled from 'styled-components';



export default function TimeWatch() {




  return (
    <Wrapper>
      <Suspense></Suspense>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  width: 300px;
  height: 200px;
`;
