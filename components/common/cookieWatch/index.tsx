import { CommonLayoutBox } from '@components/common/figure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useCallback, useState } from 'react';
import styled from 'styled-components';
import { authRepositories } from '../../../repositories/auth';
import TimeWatch from '../timeWatch';
import { getDateDiffInMillFromToday, milliSecondsToHHMMSS } from '../../../utils/tools/date';
import { CommonIconButton, TextButton } from '../button';
import { HeaderHeight } from '../../../styles/layout';
import ClockIcon from '../../../public/assets/img/clock-icon.svg';
import Image from 'next/image';

function CookieTimeWatch() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ['ADMIN_COOKIE_INFO'],
    queryFn: async () => {
      const res = await authRepositories.getCookieInfo();
      if (!res) throw new Error('COOKIE_NOT_FOUND');
      return res;
    },
  });

  const { expiredAt } = data;
  const [token, setToken] = useState('');
  const [isFetchingLogin, setIsFetchingLogin] = useState<boolean>(false);

  const login = useCallback(
    async (token: string) => {
      setIsFetchingLogin(true);
      try {
        const response = await authRepositories.login(token);
        if (response) {
          refetch();
          return;
        } else {
          throw Error('error');
        }
      } catch (e) {
        console.log(e);
        alert('다시');
      } finally {
        setIsFetchingLogin(false);
      }
    },
    [refetch],
  );

  return !isFetchingLogin ? (
    <TimeWatch
      expiredAt={expiredAt}
      timeFormatter={(timeLeft: number) => {
        if (timeLeft > 0) {
          const { hour, minute } = milliSecondsToHHMMSS(timeLeft);
          return (
            <TimeWatchBody>{`로그인 만료까지 ${hour}시간${minute}분 남았습니다.`}</TimeWatchBody>
          );
        } else {
          return (
            <TimeWatchBody>
              <p>{`로그인 만료되었습니다.`}</p>
              <div>
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="코드를 입력해주세요."
                  onChange={(e) => {
                    setToken(e.target.value);
                  }}
                />
                <TextButton
                  title="로그인"
                  onClick={() => {
                    login(token);
                  }}
                >
                  로그인
                </TextButton>
              </div>
            </TimeWatchBody>
          );
        }
      }}
    />
  ) : (
    <div>권한을 받아오는 중입니다.</div>
  );
}

export default function CookieTimeWatchWrapper() {
  const [isShowTimeWatch, setIsShowTimeWatch] = useState(false);

  const toggleTimeWatch = () => {
    setIsShowTimeWatch((prev) => !prev);
  };

  return (
    <Wrapper>
      <CookieTimeWatchBody $state={isShowTimeWatch}>
        {isShowTimeWatch ? (
          <Suspense fallback={<div>정보를 받아오는 중입니다.</div>}>
            <>
              <CookieTimeWatch />
              <CommonIconButton onClick={toggleTimeWatch}>
                <Image src={ClockIcon} alt="clock" sizes={'24'} />
              </CommonIconButton>
            </>
          </Suspense>
        ) : (
          <CommonIconButton onClick={toggleTimeWatch}>
            <Image src={ClockIcon} alt="clock" sizes={'24'} />
          </CommonIconButton>
        )}
      </CookieTimeWatchBody>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  position: fixed;
  top: calc(${HeaderHeight} + 10px);
  right: 10px;
`;

interface TimeWatchBodyProps {
  $state: boolean;
}

const CookieTimeWatchBody = styled.div<TimeWatchBodyProps>`
  width: ${({ $state }) => ($state ? '300px' : '24px')};
  height: ${({ $state }) => ($state ? '200px' : '24px')};
  border-radius: ${({ $state }) => ($state ? '12px' : '24px')};

  transition: all 0.5s ease-in-out;

  background-color: white;
`;

const TimeWatchBody = styled.div``;
