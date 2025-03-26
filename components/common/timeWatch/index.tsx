import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import IsShow from '../isShow';

interface TimeWatchProps {
  expiredAt: Date;
  timeViewer: (timeLeft: Date) => ReactNode;
}

export default function TimeWatch({ expiredAt, timeViewer }: TimeWatchProps) {
  const [curTimeLeft, setCurTimeLeft] = useState<Date | null>(null);

  useEffect(() => {
    const updateCurTime = () => {
      const curTime = new Date();
      const diff: number = expiredAt.getTime() - curTime.getTime();
      setCurTimeLeft(new Date(diff));
    };

    const timeout: ReturnType<typeof setInterval> = setInterval(updateCurTime, 50);

    return () => {
      clearInterval(timeout);
    };
  }, [expiredAt, setCurTimeLeft]);

  return (
    <Wrapper>
      <IsShow state={curTimeLeft != null}>{timeViewer(curTimeLeft!)}</IsShow>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
