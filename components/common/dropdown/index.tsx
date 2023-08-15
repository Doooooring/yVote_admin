import ArrowUp from '@images/arrow_up.png';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  title: string;
  body: string;
  style: any;
}

export default function Dropdown({ title, body, style }: DropdownProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Wrapper
      style={style}
      isExpanded={isExpanded}
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
    >
      <div className="title">{title}</div>
      <div className="body">{body}</div>
      <Image src={ArrowUp} alt="arrow" width="8" height="12" />
    </Wrapper>
  );
}

interface WrapperProps {
  isExpanded: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: absolute;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1.5rem;
  color: #7e7e7e;
  div.title {
    font-weight: bold;
  }

  div.body {
    display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
  }

  img {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    transform: ${({ isExpanded }) => (isExpanded ? 'rotateX(180deg)' : 'rotateX(0deg)')};
    transition-duration: 0.3s;
  }
`;
