import { Column, CommonLayoutBox } from '@components/common/figure';
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
import IsShow from '../isShow';

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
          const { hour, minute, second } = milliSecondsToHHMMSS(timeLeft);
          return (
            <TimeWatchBody>
              <p>로그인 만료까지</p>
              <p
                style={{
                  color: 'red',
                  fontSize: '20px',
                }}
              >{`${hour}시간${minute}분${second}초`}</p>
              <p>남았습니다.</p>
            </TimeWatchBody>
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
    <TimeWatchBody>권한을 받아오는 중입니다.</TimeWatchBody>
  );
}

export default function CookieTimeWatchWrapper() {
  const [isShowTimeWatch, setIsShowTimeWatch] = useState(false);

  const toggleTimeWatch = () => {
    setIsShowTimeWatch((prev) => !prev);
  };

  return (
    <CookieTimeWatchBody $state={isShowTimeWatch}>
      <IsShow state={isShowTimeWatch}>
        <Suspense fallback={<div>정보를 받아오는 중입니다.</div>}>
          <CookieTimeWatch />
        </Suspense>
      </IsShow>
      <IconButton onClick={toggleTimeWatch}>
        <Image src={ClockIcon} alt="clock" sizes={'24'} />
      </IconButton>
    </CookieTimeWatchBody>
  );
}

interface TimeWatchBodyProps {
  $state: boolean;
}

const CookieTimeWatchBody = styled(CommonLayoutBox)<TimeWatchBodyProps>`
  position: fixed;
  top: calc(${HeaderHeight});
  right: 40px;
  z-index: 9999999;
  width: ${({ $state }) => ($state ? '300px' : '0')};
  height: ${({ $state }) => ($state ? '200px' : '0')};
  border-radius: ${({ $state }) => ($state ? '12px' : '48px')};
  color: rgb(110, 110, 110);
  transition: all 0.3s ease-in-out;

  background-color: white;
`;

const TimeWatchBody = styled(Column)`
  height: 100%;
  padding: 1rem;
  justify-content: center;

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  p {
    margin: 0;
    margin-bottom: 6px;
  }
`;

const IconButton = styled(CommonIconButton)`
  position: absolute;
  top: calc(100% + 24px);
  left: 50%;
  transform: translate(-50%, -50%);
`;
