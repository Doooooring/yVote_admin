import { Center, CommonLayoutBox } from '@components/common/figure';
import { authRepositories } from '@repositories/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { use, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface pageProps {
  data: {};
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  return {
    props: {
      data: {},
    },
  };
};

export default function Login({ data }: pageProps) {
  const [token, setToken] = useState('');
  const navigation = useRouter();

  const login = useCallback(
    async (token: string) => {
      try {
        const response = await authRepositories.login(token);
        if (response) {
          navigation.push('/news/edit');
          return;
        } else {
          throw Error('error');
        }
      } catch (e) {
        console.log(e);
        alert('다시');
      }
    },
    [navigation],
  );

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="h-100 d-flex flex-column justify-content-center align-items-center ">
          <input
            type="text"
            className="form-control mb-4"
            placeholder="코드를 입력해주세요."
            onChange={(e) => {
              setToken(e.target.value);
            }}
          />
          <button
            className="w-40 btn btn-primary px-5"
            onClick={() => {
              login(token);
            }}
          >
            로그인
          </button>
        </div>
      </LoginWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(Center)`
  width: 100vw;
  height: 100vh;
  background-color: white;
`;

const LoginWrapper = styled(CommonLayoutBox)`
  width: 500px;
  height: 500px;
  padding: 1rem;
`;
