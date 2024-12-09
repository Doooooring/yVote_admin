import { Center, CommonLayoutBox, Row } from '@components/common/figure';
import styled from 'styled-components';

export default function AuthPage() {
  return (
    <Wrapper>
      <ContentWrapper></ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(Center)``;

const ContentWrapper = styled(CommonLayoutBox)``;
