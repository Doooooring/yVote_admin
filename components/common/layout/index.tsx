import styled from 'styled-components';

import { useRouteState } from '@utils/hook/useRouteState';
import { ReactNode } from 'react';
import LoadingIndicator from './loading';
import { useCommonStore } from '@store/common';

const Layout = ({ children }: { children: ReactNode }) => {
  const routeState = useRouteState();
  const isLoading = useCommonStore((state) => state.isLoading);
  return (
    <Wrapper>
      <ContentWrapper>{children}</ContentWrapper>
      <LoadingIndicator state={isLoading || routeState} />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div``;

const ContentWrapper = styled.div`
  position: relative;
`;
