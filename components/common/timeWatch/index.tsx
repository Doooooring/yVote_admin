import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import IsShow from '../isShow';

interface TimeWatchProps {
  expiredAt: Date;
  timeFormatter: (timeLeft: number) => ReactNode;
  isThrowError?: boolean;
}

export default function TimeWatch({
  expiredAt,
  timeFormatter,
  isThrowError = false,
}: TimeWatchProps) {
  const [isError, setIsError] = useState<boolean>(false);
  const [curTimeLeft, setCurTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateCurTime = () => {
      const curTime = new Date();
      const diff: number = expiredAt.getTime() - curTime.getTime();
      setCurTimeLeft(diff);
    };

    const timeout: ReturnType<typeof setInterval> = setInterval(updateCurTime, 1000);

    return () => {
      clearInterval(timeout);
    };
  }, [expiredAt, setCurTimeLeft]);

  if (isThrowError && curTimeLeft !== null && curTimeLeft < 0) {
    throw new Error('TIME_WATCH_ERROR');
  }

  return (
    <Wrapper>
      <IsShow state={curTimeLeft != null}>{timeFormatter(curTimeLeft!)}</IsShow>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
