import { Center, CommonLayoutBox } from '@components/common/figure';
import { authRepositories } from '@repositories/auth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
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
        if (response.data) {
          navigation.push('/news/post');
        }
        throw Error('error');
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
        <input
          type="text"
          className="form-control"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
        <button
          onClick={() => {
            login(token);
          }}
        >
          로그인
        </button>
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
