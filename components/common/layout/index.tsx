import styled from 'styled-components';

import { useRouteState } from '@utils/hook/useRouteState';
import { ReactNode } from 'react';
import LoadingIndicator from './loading';

const Layout = ({ children }: { children: ReactNode }) => {
  const routeState = useRouteState();

  return (
    <Wrapper>
      <ContentWrapper>{children}</ContentWrapper>
      <LoadingIndicator state={routeState} />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div``;

const ContentWrapper = styled.div`
  position: relative;
`;
