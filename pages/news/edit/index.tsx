import { PrimaryButton } from '@components/common/button';
import ProtectedLayout from '@components/common/protectedLayout';
import SearchBox from '@components/keyword/search';
import { SearchState } from '@components/keyword/searchState';
import EditNews from '@components/news/editNews';
import IdSelector from '@components/news/idSelector';
import { KeywordTitle } from '@interface/keywords';
import { initNews, NewsTitle, NewsToEdit, NewsToPatch, setDefaultNews } from '@interface/news';
import { keywordRepositories } from '@repositories/keyword';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';

import 'bootstrap/dist/css/bootstrap.min.css';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
    keywordTitles: Array<KeywordTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const newsTitles: Array<NewsTitle> = await newsRepositories.getNewsTitles('');
  const keywordTitles: Array<KeywordTitle> = await keywordRepositories.getKeywordTitles('');

  return {
    props: {
      data: {
        newsTitles,
        keywordTitles,
      },
    },
  };
};

export default function NewsPatch({ data }: pageProps) {
  const router = useRouter();

  const [news, setNews] = useState<NewsToEdit | null>(null);

  const [newsSearchList, setNewsSearchList] = useState<NewsTitle[]>([]);
  const [newsSearchErr, setNewsSearchErr] = useState<boolean>(false);
  const [newsSelectorUp, setNewsSelectorup] = useState<boolean>(false);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);

  const setCommentSelected = useNewsStore((state) => state.setCommentSelected);
  const setKeywordTitleList = useKeywordStore((state) => state.setKeywordTitleList);

  useEffect(() => {
    setKeywordTitleList(data.keywordTitles);
  }, []);

  const findNews = useCallback(async (searchWord: string) => {
    setIsLoading(true);

    try {
      const response = await newsRepositories.getNewsTitles(searchWord);

      setNewsSearchList(response);
      setNewsSelectorup(true);

      return true;
    } catch {
      setNewsSearchErr(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNews = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const newsOrg = await newsRepositories.getNewsDetails(id);
      setNews(setDefaultNews(newsOrg) as NewsToEdit);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateNewNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const newsDefault = initNews();
      newsDefault.isPublished = false;
      const id = await newsRepositories.postNews(newsDefault);

      setNews({ id: id, ...newsDefault });
    } catch (e) {
      alert('다시 시도해보세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submit = async (news: NewsToPatch) => {
    if (!news) return;
    setIsLoading(true);
    try {
      const result: boolean = await newsRepositories.patchNews(news);
      if (!result) {
        Error();
        return;
      }
      alert('저장되었습니다~');
      router.reload();

      return result;
    } catch (e) {
      alert('다시 시도해보세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <Wrapper>
        <InputWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>새로 만들기</InputTitle>
          <PrimaryButton title="+" click={generateNewNews} />
        </InputWrapper>
        <SearchBox findKeyword={findNews} />
        <IdSelector
          newsSearchList={newsSearchList}
          getNews={getNews}
          newsSelectorUp={newsSelectorUp}
          setNewsSelectorUp={setNewsSelectorup}
        />
        {news ? <EditNews newsOrg={news} submit={submit} /> : <></>}
        <SearchState searchErr={newsSearchErr} loading={isLoading} />
      </Wrapper>
    </ProtectedLayout>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  font-size: 18px;
  padding-top: 100px;
`;

interface ContentWrapperProps {
  state: boolean;
}

const TextEditWrapper = styled.div<ContentWrapperProps>`
  width: 100%;
  display: ${({ state }) => (state ? 'flex' : 'none')};

  flex-direction: row;
`;

const ContentEditWrapper = styled.div`
  width: 1300px;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

const NewsPreviewWrapper = styled.div`
  width: 100%;

  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;

  background-color: #f1f2f3;
`;

const StateToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0;
`;

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
  width: 100%;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`;
const InputTitle = styled.div`
  flex: 1 0 auto;
  font-size: 16px;
  font-weight: bold;
  padding: 0 1rem;
  min-width: 80px;
`;

const ToggleTitle = styled.div`
  flex: 0 1 1;
  font-size: 14px;
  font-weight: bold;
  padding: 0 0.5rem;
`;

const OpinionTitle = styled.div`
  flex: 1 0 auto;
  width: 120px;
  font-size: 18px;
`;

const OpinionLeft = styled(OpinionTitle)`
  color: blue;
`;
const OpinionRight = styled(OpinionTitle)`
  color: red;
`;

const Input = styled.input``;

const OpinionWrapper = styled.div``;

const InputBody = styled.div`
  gap: 20px;
`;

const KeywordSetter = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
`;

const KeywordWrapper = styled.ul`
  padding: 0.375rem 0.75rem;
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-top: 10px;
`;
const KeywordLi = styled.li`
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-bottom: 5px;
`;

const SubmitWrapper = styled.div`
  padding: 0.5rem;
`;
