import { CommonLayoutBox } from '@components/common/figure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import styled from 'styled-components';
import { authRepositories } from '../../../repositories/auth';
import TimeWatch from '../timeWatch';
import { milliSecondsToHHMMSS } from '../../../utils/tools/date';

function CookieTimeWatch() {
  const cookieInfo = useSuspenseQuery({
    queryKey: ['cookieInfo'],
    queryFn: async () => {
      const res = await authRepositories.getCookieInfo();
      if (!res) throw new Error('COOKIE_NOT_FOUND');
      return res;
    },
  });

  return (
    <TimeWatch
      expiredAt={cookieInfo?.data?.expiredAt}
      timeFormatter={(timeLeft: number) => {
        const { hour, minute } = milliSecondsToHHMMSS(timeLeft);

        return <span>{`${hour}시간${minute}분 뒤 재로그인 필요함`}</span>;
      }}
    />
  );
}

export default function CookieTimeWatchWrapper() {
  return (
    <Wrapper>
      <Suspense></Suspense>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  width: 300px;
  height: 200px;
`;
