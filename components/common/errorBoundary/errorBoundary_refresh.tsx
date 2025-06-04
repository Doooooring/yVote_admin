import { Component, ComponentType, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Column } from '../figure';

type FallbackProps = { refresh: () => void };

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback: ComponentType<{ refresh: () => void }>;
}

interface CommonErrorBoundaryState {
  hasError: boolean;
}

/**
 * @description 공통 에러 컴포넌트
 */
class ErrorBoundary_Refresh extends Component<ErrorBoundaryProps, CommonErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    console.log('is rerendered?');
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): Partial<CommonErrorBoundaryState> {
    console.log('is error');

    return { hasError: true };
  }

  handleRetry = () => {
    console.log('is called?');

    this.setState(() => ({
      hasError: false,
    }));
  };

  render() {
    console.log(this.state.hasError);

    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      return <Fallback refresh={this.handleRetry} />;
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary_Refresh;

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
