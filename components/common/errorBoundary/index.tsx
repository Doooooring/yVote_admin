import logoImage from '@images/logo_image.png';
import Image from 'next/image';
import { Component, ReactNode } from 'react';
import styled from 'styled-components';
import { Column } from '../figure';

interface CommonErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface CommonErrorBoundaryState {
  hasError: boolean;
}

/**
 * @description 공통 에러 컴포넌트
 */
class CommonErrorBoundary extends Component<CommonErrorBoundaryProps, CommonErrorBoundaryState> {
  constructor(props: CommonErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): Partial<CommonErrorBoundaryState> {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState(() => ({
      hasError: false,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Image className="pear" src={logoImage} alt="logo" width="150" height="150" />
          <Head>현재 서버가 원활하지 않습니다.</Head>
          <Comment>죄송합니다. 빠르게 조치 후 돌아오겠습니다.</Comment>
          <Comment>더 나은 서비스를 제공하기 위해 항상 노력하겠습니다.</Comment>
        </Wrapper>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default CommonErrorBoundary;

const Wrapper = styled(Column)`
  width: 100vw;
  height: 100vh;

  justify-content: center;
  align-items: center;

  background-color: white;

  .pear {
    animation: rotate-fade-out 6s ease-in-out infinite;
  }

  @keyframes rotate-fade-out {
    0% {
      opacity: 1;
      transform: rotateY(0deg);
    }

    100% {
      opacity: 0;
      transform: rotateY(1080deg);
    }
  }
`;

const Head = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-bottom: 12px;
`;

const Comment = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  margin-bottom: 4px;
`;
