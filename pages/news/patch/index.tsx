import { SubmitButton } from '@components/common/button';
import KeywordSelect from '@components/news/keywordSelect';
import { Keyword } from '@interface/keywords';
import { News, Press } from '@interface/news';
import { keywordRepositories } from '@repositories/keyword';
import { NewsToPatch, newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { clone } from '@utils';

import 'bootstrap/dist/css/bootstrap.min.css';

import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}
interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
    keywordTitles: Array<any>;
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
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [newsList, setNewsList] = useState<News['news']>([
    {
      date: '',
      title: '',
      link: '',
    },
  ]);
  const [journals, setJournals] = useState<News['journals']>([
    {
      press: '조선',
      title: '',
      link: '',
    },
  ]);
  const [state, setState] = useState<boolean>(true);
  const [opinions, setOpinions] = useState<News['opinions']>({
    left: '',
    right: '',
  });
  const [keywordList, setKeywordList] = useState<Array<string>>([]);

  const [newsSearchList, setNewsSearchList] = useState<NewsTitle[]>([]);
  const [newsSearchErr, setNewsSearchErr] = useState<boolean>(false);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);
  const setIsModalUp = useCommonStore((state) => state.setIsModalup);

  const setKeywordTitleList = useKeywordStore((state) => state.setKeywordTitleList);
  const keywordTitleList = useKeywordStore((state) => state.keywordTitleList);

  useEffect(() => {
    setKeywordTitleList(data.keywordTitles);
  }, []);

  const findNews = useCallback(async (searchWord: string) => {
    setIsLoading(true);
    const response = await newsRepositories.getNewsTitles(searchWord);
    setNewsSearchList(response);
    setIsLoading(false);
  }, []);

  const getNews = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await newsRepositories.getNewsDetails(id);
      if (response === false) Error();
      else {
        const { _id, title, summary, news, journals, keywords, state, opinions }: NewsToPatch =
          response;
        setId(_id);
        setTitle(title!);
        setSummary(summary!);
        setNewsList(news!);
        setJournals(journals!);
        setKeywordList(keywords!);
        setState(state!);
        setOpinions(opinions!);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submit = useCallback(async () => {
    setIsLoading(true);
    const result: boolean = await newsRepositories.postNews({
      summary,
      title,
      state,
      opinions,
      journals,
      news: newsList,
      keywords: keywordList,
    });
    return result;
  }, [title, summary, newsList, journals, state, opinions, keywordList]);

  const addNews = useCallback(
    (idx: number) => {
      const curNewsList = clone(newsList);
      curNewsList.splice(idx + 1, 0, {
        date: '',
        title: '',
        link: '',
      });

      setNewsList(curNewsList);
    },
    [newsList],
  );

  const deleteNews = useCallback(
    (idx: number) => {
      if (newsList.length == 1) {
        return;
      }
      const curNewsList = clone(newsList);
      curNewsList.splice(idx, 1);
      setNewsList(curNewsList);
    },
    [newsList],
  );

  const addJournals = useCallback(
    (idx: number) => {
      const curJournals = clone(journals);
      curJournals.splice(idx + 1, 0, {
        press: '조선',
        title: '',
        link: '',
      });
      setJournals(curJournals);
    },
    [journals],
  );

  const deleteJournals = useCallback(
    (idx: number) => {
      const curJournals = clone(journals);
      curJournals.splice(idx, 1);
      setJournals(curJournals);
    },
    [journals],
  );

  return (
    <Wrapper>
      <ContentWrapper className="mb-5">
        <InputWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>제목</InputTitle>
          <Input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <InputWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>설명</InputTitle>
          <Input
            type="textarea"
            className="form-control"
            placeholder="의도적으로 줄 넘기고 싶으면 $ 넣기"
            value={summary}
            onChange={(e) => {
              setSummary(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <NewsInputWrapper className="pb-1 pt-1 mb-1">
          <LayerTitleWrapper>
            <InputTitle>관련 뉴스</InputTitle>
          </LayerTitleWrapper>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {newsList.map((news, idx) => {
              return (
                <NewsInputLayer key={idx} className="shadow p-3 bg-white rounded">
                  <ButtonWrapper>
                    <Button className="btn btn-primary" onClick={() => addNews(idx)}>
                      {' '}
                      추가{' '}
                    </Button>
                    <Button className="btn btn-secondary" onClick={() => deleteNews(idx)}>
                      {' '}
                      삭제{' '}
                    </Button>
                  </ButtonWrapper>
                  <InputWrapper>
                    <SubInputTitle>날짜</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      placeholder="xxxx.xx 형식으로 넣으세요"
                      value={news.date}
                      onChange={(e) => {
                        const curNewsList = clone(newsList);
                        curNewsList[idx].date = e.currentTarget.value;
                        setNewsList(curNewsList);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>링크</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.link}
                      onChange={(e) => {
                        const curNewsList = clone(newsList);
                        curNewsList[idx].link = e.currentTarget.value;
                        setNewsList(curNewsList);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.title}
                      onChange={(e) => {
                        const curNewsList = clone(newsList);
                        curNewsList[idx].title = e.currentTarget.value;
                        setNewsList(curNewsList);
                      }}
                    ></SubInput>
                  </InputWrapper>
                </NewsInputLayer>
              );
            })}
          </LayerWrapper>
        </NewsInputWrapper>
        <JournalsWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>저널</InputTitle>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {journals.map((journal, idx) => {
              return (
                <JournalLayer key={idx} className="shadow p-3 bg-white rounded">
                  <ButtonWrapper>
                    <Button className="btn btn-primary" onClick={() => addJournals(idx)}>
                      {' '}
                      추가{' '}
                    </Button>
                    <Button className="btn btn-secondary" onClick={() => deleteJournals(idx)}>
                      {' '}
                      삭제{' '}
                    </Button>
                  </ButtonWrapper>
                  <InputWrapper>
                    <SubInputTitle>언론사</SubInputTitle>
                    <PressSelect
                      className="form-select"
                      value={journal.press}
                      onChange={(e) => {
                        const curJournals = clone(journals);
                        curJournals[idx].press = e.currentTarget.value as Press;
                        setJournals(curJournals);
                      }}
                    >
                      <option value="조선">조선</option>
                      <option value="중앙">중앙</option>
                      <option value="동아">동아</option>
                      <option value="한겨레">한겨레</option>
                      <option value="한경">한경</option>
                      <option value="매경">매경</option>
                    </PressSelect>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>링크</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={journal.link}
                      onChange={(e) => {
                        const curJournals = clone(journals);
                        curJournals[idx].link = e.currentTarget.value;
                        setJournals(curJournals);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={journal.title}
                      onChange={(e) => {
                        const curJournals = clone(journals);
                        curJournals[idx].title = e.currentTarget.value;
                        setJournals(curJournals);
                      }}
                    ></SubInput>
                  </InputWrapper>
                </JournalLayer>
              );
            })}
          </LayerWrapper>
        </JournalsWrapper>
        <InputWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>상태</InputTitle>
          <Select
            className="form-control"
            value={state === true ? '최신' : '구닥다리'}
            onChange={(e) => {
              if (e.currentTarget.value === 'true') {
                setState(true);
              } else {
                setState(false);
              }
            }}
          >
            <option value={'true'}>최신</option>
            <option value={'false'}>구닥다리</option>
          </Select>
        </InputWrapper>
        <OpinionWrapper className="d-flex flex-row  align-items-center mb-3 mt-3">
          <InputTitle>의견</InputTitle>
          <InputBody className="d-flex flex-row align-items-center w-100">
            <OpinionLeft>왼쪽</OpinionLeft>
            <Input
              type="text"
              className="form-control"
              value={opinions.left}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.left = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>

            <OpinionRight>오른쪽</OpinionRight>
            <Input
              type="text"
              className="form-control"
              value={opinions.right}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.right = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>
          </InputBody>
        </OpinionWrapper>
        <KeywordSetter>
          <SubmitButton
            title={'키워드 선택하기'}
            click={() => {
              setIsModalUp(true);
            }}
          />
          <KeywordWrapper>
            {keywordList.map((keyword, idx) => {
              let curTitle: string | undefined = '';
              for (let keywordTitle of keywordTitleList) {
                if (keywordTitle._id === keyword) {
                  curTitle = keywordTitle.keyword;
                }
              }
              return <KeywordLi key={idx}>{curTitle}</KeywordLi>;
            })}
          </KeywordWrapper>
        </KeywordSetter>
        <SubmitWrapper>
          <SubmitButton
            title="SUBMIT"
            click={() => {
              if (isLoading) return;
              submit();
            }}
          />
        </SubmitWrapper>
        <KeywordSelect curKeywordList={keywordList} setCurKeywordList={setKeywordList} />
      </ContentWrapper>
    </Wrapper>
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

const ContentWrapper = styled.div`
  width: 50%;
  min-width: 60rem;
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
  width: 100px;
  font-size: 18px;
  font-weight: bold;
`;

const OpinionTitle = styled.div`
  width: 120px;
  font-size: 18px;
`;

const OpinionLeft = styled(OpinionTitle)`
  color: blue;
`;
const OpinionRight = styled(OpinionTitle)`
  color: red;
`;

const SubInputTitle = styled.div`
  width: 50px;
  font-size: 18px;
`;

const Input = styled.input``;

const SubInput = styled.input`
  width: 200px;
`;

const NewsInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LayerTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const LayerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow: scroll;
`;

const NewsInputLayer = styled.div`
  display: flex;
  flex-direction: column;
`;

const JournalsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const JournalLayer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OpinionWrapper = styled.div``;

const InputBody = styled.div`
  gap: 20px;
`;

const PressSelect = styled.select`
  width: 200px;
`;

const Select = styled.select``;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button``;

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

const SubmitWrapper = styled.div``;
