import styled from 'styled-components';

import Header from '@components/common/header';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Wrapper>
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div``;

const ContentWrapper = styled.div`
  position: relative;
`;
