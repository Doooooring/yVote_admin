import styled from 'styled-components';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface LoadingCommonProps {
  comment: string;
  isRow?: boolean;
  fontSize?: string;
  fontColor?: string;
  iconSize?: number;
}

export default function LoadingCommon({
  comment,
  isRow = true,
  fontSize = '1rem',
  fontColor = 'white',
  iconSize = 16,
}: LoadingCommonProps) {
  return (
    <Wrapper $isRow={isRow} fontSize={fontSize} fontColor={fontColor}>
      <FontAwesomeIcon
        className="spinner"
        icon={faSpinner as IconProp}
        width={iconSize}
        height={iconSize}
      />
    </Wrapper>
  );
}

interface WrapperProps {
  $isRow: boolean;
  fontSize: string;
  fontColor: string;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: ${({ $isRow }) => ($isRow ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  font-size: ${({ fontSize }) => fontSize};
  line-height: 1;
  font-weight: 500;
  padding: 1rem 0;
  color: ${({ fontColor }) => fontColor};

  p {
    min-width: ${({ fontSize }) => fontSize};
    min-height: ${({ fontSize }) => fontSize};
  }

  animation: blink 0.75s ease-in-out infinite;

  @keyframes blink {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  .spinner {
    animation: spin 2.5s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;
