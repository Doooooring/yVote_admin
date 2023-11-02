import { SubmitButton } from '@components/common/button';
import NewsSelect from '@components/keyword/newsSelect';
import SearchBox from '@components/keyword/search';
import { SearchState } from '@components/keyword/searchState';
import { category as Category, Keyword } from '@interface/keywords';
import { News } from '@interface/news';
import { keywordRepositories } from '@repositories/keyword';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import styled from 'styled-components';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}
interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

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
export default function KeywordPatch({ data }: pageProps) {
  const [id, setId] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [explain, setExplain] = useState<string>('');
  const [category, setCategory] = useState<Keyword['category']>(Category.human);
  const [newsList, setNewsList] = useState<Array<string>>([]);
  const [keywordSearchErr, setKeywordSearchErr] = useState<boolean>(false);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);
  const setIsSelectorModalUp = useCommonStore((state) => state.setIsSelectorModalUp);
  const setNewsTitleList = useNewsStore((store) => store.setNewsTitleList);
  const newsTitleList = useNewsStore((store) => store.newsTitleList);
  const setKeywordTitleList = useKeywordStore((store) => store.setKeywordTitleList);

  useEffect(() => {
    setNewsTitleList(data.newsTitles);
    setKeywordTitleList(data.keywordTitles);
  }, []);

  const findKeyword = async (searchWord: string) => {
    setIsLoading(true);
    const encoded = searchWord.replace(/\//g, '$');

    try {
      const { _id, keyword, category, explain, news }: Keyword =
        await keywordRepositories.getKeyword(encoded);
      setId(_id);
      setKeyword(keyword);
      setCategory(category);
      setExplain(explain);
      setNewsList(news);
      setKeywordSearchErr(false);
    } catch {
      setKeyword('');
      setKeywordSearchErr(true);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  };

  const resetInput = () => {
    setId('');
    setKeyword('');
    setCategory(Category.economics);
    setExplain('');
    setNewsList([]);
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      const result: boolean = await keywordRepositories.patchKeyword({
        _id: id,
        keyword: keyword,
        category: category,
        explain: explain,
        news: newsList,
      });
      if (result) {
        resetInput();
      } else {
        Error('patch error');
        alert('patch error');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <SearchBox findKeyword={findKeyword} />
      <ContentWrapper state={keyword === ''}>
        <InputWrapper>
          <InputTitle>키워드</InputTitle>
          <Input
            type="text"
            className="form-control"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <InputWrapper>
          <InputTitle>설명</InputTitle>
          <Input
            type="textarea"
            className="form-control"
            placeholder="의도적으로 줄 넘기고 싶으면 $ 넣기"
            value={explain}
            onChange={(e) => {
              setExplain(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <InputWrapper>
          <InputTitle>카테고리</InputTitle>
          <Select
            className="form-select"
            value={category}
            onChange={(e) => {
              setCategory(e.currentTarget.value as Category);
            }}
          >
            <option value={Category.human}>인물</option>
            <option value={Category.politics}>정치</option>
            <option value={Category.policy}>정책</option>
            <option value={Category.economics}>경제</option>
            <option value={Category.social}>사회</option>
            <option value={Category.organization}>조직</option>
            <option value={Category.etc}>기타</option>
          </Select>
        </InputWrapper>
        <NewsSetter>
          <SubmitButton
            title={'뉴스 선택하기'}
            click={() => {
              setIsSelectorModalUp(true);
            }}
          />
          <NewsWrapper>
            {newsList.map((news) => {
              let curTitle: string | undefined = '';
              for (let newstitle of newsTitleList) {
                if (newstitle._id === news) {
                  curTitle = newstitle.title;
                }
              }
              return <NewsLi key={news}>{curTitle}</NewsLi>;
            })}
          </NewsWrapper>
        </NewsSetter>
        <SubmitWrapper>
          <SubmitButton
            title="SUBMIT"
            click={() => {
              submit();
            }}
          />
        </SubmitWrapper>
        <NewsSelect curNewsList={newsList} setCurNewsList={setNewsList}></NewsSelect>
      </ContentWrapper>
      <SearchState searchErr={keywordSearchErr} loading={isLoading} />
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

interface ContentWrapperProps {
  state: boolean;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: ${({ state }) => (state ? 'none' : 'block')};
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
`;

const Input = styled.input``;
const Select = styled.select``;

const NewsSetter = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
`;

const NewsWrapper = styled.ul`
  padding: 0.375rem 0.75rem;
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-top: 10px;
`;
const NewsLi = styled.li`
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-bottom: 5px;
`;

const SubmitWrapper = styled.div``;
