import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface NavBoxProps {
  link: string;
  comment: string;
  state: boolean;
}

function NavBox({ link, comment, state }: NavBoxProps) {
  return (
    <HomeLink href={`${link}`} state={state}>
      {comment}
    </HomeLink>
  );
}

export default function Header() {
  const navigation = useRouter();
  const [curTab, setCurTab] = useState<string>('home');

  useEffect(() => {
    if (navigation.pathname === '/error') {
      console.log("it's error");
      return;
    }
    if (navigation.pathname.includes('news/post')) {
      setCurTab('news/post');
    } else if (navigation.pathname.includes('news/patch')) {
      setCurTab('news/patch');
    } else if (navigation.pathname.includes('keyword/post')) {
      setCurTab('keyword/post');
    } else if (navigation.pathname.includes('keyword/patch')) {
      setCurTab('keyword/patch');
    } else if (navigation.pathname.includes('news/delete')) {
      setCurTab('news/delete');
    } else if (navigation.pathname.includes('keyword/delete')) {
      setCurTab('keyword/delete');
    } else {
      setCurTab('home');
    }
  }, [navigation]);

  return (
    <Wrapper>
      <HeaderBody>
        <NavigationBox>
          <NavBox link={'/news/post'} comment="뉴스 새로넣기" state={curTab === 'news/post'} />
          <Blank />
          <NavBox link={'/news/patch'} comment="뉴스 수정하기" state={curTab === 'news/patch'} />
          <Blank />
          <NavBox
            link={'/keyword/post'}
            comment="키워드 새로넣기"
            state={curTab === 'keyword/post'}
          />
          <Blank />
          <NavBox
            link={'/keyword/patch'}
            comment="키워드 수정하기"
            state={curTab === 'keyword/patch'}
          />{' '}
          <Blank />
          <Blank />
          <NavBox link={'/news/delete'} comment="뉴스 지우기" state={curTab === 'news/delete'} />
          <Blank />
          <NavBox
            link={'/keyword/delete'}
            comment="키워드 지우기"
            state={curTab === 'keyword/delete'}
          />
        </NavigationBox>
      </HeaderBody>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-width: 800px;
  height: 80px;
  font-size: 15px;
  text-align: left;
  color: black;
  background-color: white;
  box-shadow: 0px 0px 30px -25px;

  top: 0;
  z-index: 9999;
  border-width: 0px;
  border-bottom-width: 4px;
`;

const HeaderBody = styled.div`
  width: 1000px;
  height: 100%;
  position: relative;
  margin-right: auto;
  margin-left: auto;
`;

const LogoImgBox = styled.div`
  position: absolute;
  left: 0;
  width: 30%;
  height: 100%;
`;

interface homeLinkProps {
  state: boolean;
}

const HomeLink = styled(Link)<homeLinkProps>`
  border-bottom: none;
  color: ${({ state }) => (state ? 'rgb(61, 152, 247)' : 'grey')};
  border-bottom: ${({ state }) => (state ? '3px solid rgb(61, 152, 247)' : 'none')};
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-decoration: none;
`;
const Logo = styled.img``;
const NavigationBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Blank = styled.div`
  width: 30px;
`;
