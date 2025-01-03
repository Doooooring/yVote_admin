import 'bootstrap/dist/css/bootstrap.min.css';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { SubmitButton } from '@components/common/button';
import NewsSelect from '@components/keyword/newsSelect';
import { NewsTitle } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useNewsStore } from '@store/news';

import TextEditor from '@components/common/textEditor';
import ExplainPreview from '@components/keyword/explainPreview';
import { Keyword, KeywordCategory, KeywordTitle } from '@interface/keywords';
import { keywordRepositories } from '@repositories/keyword';
import { useReactQuill } from '@utils/hook/useReactQuill';
import { GetServerSideProps } from 'next';
import ProtectedLayout from '@components/common/protectedLayout';

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

export default function KeywordPost({ data }: pageProps) {
  const { ref, content, handleContents, resetContents } = useReactQuill();

  const [keyword, setKeyword] = useState<string>('');
  const [explain, setExplain] = useState<string>('');
  const [keywordImg, setKeywordImg] = useState<string | null>(null);
  const [category, setCategory] = useState<Keyword['category']>(KeywordCategory.Human);
  const [newsList, setNewsList] = useState<Array<{ id: number; title: string }>>([]);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);
  const setIsSelectorModalUp = useCommonStore((state) => state.setIsSelectorModalUp);
  const setNewsTitleList = useNewsStore((store) => store.setNewsTitleList);
  const newsTitleList = useNewsStore((store) => store.newsTitleList);

  useEffect(() => {
    setNewsTitleList(data.newsTitles);
  }, []);

  const submit = async () => {
    setIsLoading(true);
    try {
      const result: boolean = await keywordRepositories.postKeyword({
        keyword: keyword,
        category: category,
        keywordImage: keywordImg,
        explain: content,
        news: newsList,
      });
      if (result) {
        alert('잘감');
        resetInput();
      } else {
        Error();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetInput = useCallback(() => {
    setKeyword('');
    setExplain('');
    resetContents();
    setCategory(KeywordCategory.Human);
    setKeywordImg(null);
    setNewsList([]);
  }, [setKeyword, setExplain, resetContents, setCategory, setNewsList]);

  return (
    <ProtectedLayout>
      <Wrapper>
        <ContentWrapper>
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
          <TextEditor ref={ref} style={{ height: '600px' }} onChange={handleContents} />
          <ExplainPreview keyword={keyword} explain={content} />
          <InputWrapper>
            <InputTitle>카테고리</InputTitle>
            <Select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.currentTarget.value as KeywordCategory);
              }}
            >
              <option value={KeywordCategory.Human}>인물</option>
              <option value={KeywordCategory.Politics}>정치</option>
              <option value={KeywordCategory.Policy}>정책</option>
              <option value={KeywordCategory.Economics}>경제</option>
              <option value={KeywordCategory.Social}>사회</option>
              <option value={KeywordCategory.Organization}>조직</option>
              <option value={KeywordCategory.Etc}>기타</option>
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
                for (let newsTitle of newsTitleList) {
                  if (newsTitle.id === news.id) {
                    curTitle = newsTitle.title;
                  }
                }
                return <NewsLi key={news.id}>{curTitle}</NewsLi>;
              })}
            </NewsWrapper>
          </NewsSetter>
          <SubmitWrapper>
            <SubmitButton
              title="SUBMIT"
              click={() => {
                if (isLoading) return;
                submit();
              }}
            />
          </SubmitWrapper>
          <NewsSelect curNewsList={newsList} setCurNewsList={setNewsList} />
        </ContentWrapper>
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
  margin-top: 20px;
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
