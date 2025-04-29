import { PrimaryButton } from '@components/common/button';
import ProtectedLayout from '@components/common/protectedLayout';
import TextEditor from '@components/common/textEditor';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';

interface pageProps {
  data: {
    keywordTitles: Array<KeywordTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const keywordTitles: Array<KeywordTitle> = await keywordRepositories.getKeywordTitles('');

  return {
    props: {
      data: {
        keywordTitles,
      },
    },
  };
};

export default function NewsPatch({ data }: pageProps) {
  const a = useRef<ReactQuill>(null);
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
        <IdSelector
          newsSearchList={newsSearchList}
          getNews={getNews}
          newsSelectorUp={newsSelectorUp}
          setNewsSelectorUp={setNewsSelectorup}
        />
        {news ? (
          <EditNews newsOrg={news} submit={submit} />
        ) : (
          <>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <InputTitle>새로 만들기</InputTitle>
              <PrimaryButton title="+" click={generateNewNews} />
            </InputWrapper>
            <SearchBox findKeyword={findNews} />
          </>
        )}
        <SearchState searchErr={newsSearchErr} loading={isLoading} />
      </Wrapper>
      <PreLoaded>
        <TextEditor ref={a} onChange={() => {}} />
      </PreLoaded>
    </ProtectedLayout>
  );
}

const PreLoaded = styled.div`
  display: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  font-size: 18px;
  padding-top: 100px;
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
