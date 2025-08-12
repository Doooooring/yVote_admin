import { Column, CommonLayoutBox } from '@components/common/figure';
import { ErrorBoundary } from '@suspensive/react';
import { Mutation } from '@suspensive/react-query';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Suspense, useCallback, useState } from 'react';
import styled from 'styled-components';
import ClockIcon from '../../../public/assets/img/clock-icon.svg';
import { authRepositories } from '../../../repositories/auth';
import { HeaderHeight } from '../../../styles/layout';
import { milliSecondsToHHMMSS } from '../../../utils/tools/date';
import { CommonIconButton, PrimaryButton } from '../button';
import LoadingCommon from '../loadingCommon';
import TimeWatch from '../timeWatch';

const adminCookieInfoQueryOption = queryOptions({
  queryKey: ['AdminCookieInfo'],
  queryFn: authRepositories.getCookieInfo,
  staleTime: 0,
});

function CookieTimeWatch() {
  const { data } = useSuspenseQuery(adminCookieInfoQueryOption);

  const { expiredAt } = data;

  return (
    <TimeWatch
      expiredAt={expiredAt}
      timeFormatter={(timeLeft: number) => {
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
      }}
      isThrowError={true}
    />
  );
}

function ReLogin({ refresh }: { refresh: () => void }) {
  const { refetch } = useQuery({
    ...adminCookieInfoQueryOption,
    retry: false,
  });

  const [token, setToken] = useState<string>('');

  const login = useCallback(
    async (token: string) => {
      try {
        const response = await authRepositories.login(token);
        if (response) {
          await refetch();
          refresh();
          return;
        } else {
          throw Error('error');
        }
      } catch (e) {
        alert('다시해주세요');
      }
    },
    [refetch, refresh],
  );

  return (
    <TimeWatchBody>
      <Mutation
        key="Relogin"
        mutationFn={async (token: string) => {
          return login(token);
        }}
      >
        {(loginMutation) => (
          <>
            <p>{`로그인 만료되었습니다.`}</p>
            <div>
              <input
                type="text"
                className="form-control mb-4"
                disabled={loginMutation.isPending}
                placeholder="코드를 입력해주세요."
                onChange={(e) => {
                  setToken(e.target.value);
                }}
              />
              <PrimaryButton
                title="로그인"
                disabled={loginMutation.isPending}
                click={() => {
                  if (loginMutation.isPending) return;
                  loginMutation.mutate(token);
                }}
              />
            </div>
            {loginMutation.isPending && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                <LoadingCommon fontColor="black" iconSize={24} />
              </div>
            )}
          </>
        )}
      </Mutation>
    </TimeWatchBody>
  );
}

export default function CookieTimeWatchWrapper() {
  const [isShowTimeWatch, setIsShowTimeWatch] = useState(false);

  const toggleTimeWatch = () => {
    setIsShowTimeWatch((prev) => !prev);
  };

  return (
    <CookieTimeWatchBody $state={isShowTimeWatch}>
      {isShowTimeWatch && (
        <ErrorBoundary fallback={({ reset }) => <ReLogin refresh={reset} />}>
          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <LoadingCommon fontColor="black" iconSize={24} />
              </div>
            }
          >
            <CookieTimeWatch />
          </Suspense>
        </ErrorBoundary>
      )}
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
