import { useReactQuill } from '@/utils/hook/useReactQuill';
import { PrimaryButton } from '@components/common/button';
import ImageUpload from '@components/common/imageUpload';
import ProtectedLayout from '@components/common/protectedLayout';
import TextEditor from '@components/common/textEditor';
import ExplainPreview from '@components/keyword/explainPreview';
import SearchBox from '@components/keyword/search';
import { SearchState } from '@components/keyword/searchState';
import { Keyword, KeywordCategory, KeywordTitle } from '@interface/keywords';
import { NewsTitle } from '@interface/news';
import { keywordRepositories } from '@repositories/keyword';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';

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

export default function KeywordPatch({ data }: pageProps) {
  const { ref, content, handleContents, initializeQuillContents, resetContents } = useReactQuill();

  const [id, setId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<Keyword['category']>(KeywordCategory.Human);
  const [keywordImg, setKeywordImg] = useState<string | null>(null);
  const [newsList, setNewsList] = useState<Array<NewsTitle>>([]);
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
      const { id, keyword, category, keywordImage, explain } = await keywordRepositories.getKeyword(
        encoded,
      );
      setId(id);
      setKeyword(keyword);
      setCategory(category);
      setKeywordImg(keywordImage);
      initializeQuillContents(explain);
      setKeywordSearchErr(false);
    } catch {
      setKeyword('');
      setKeywordSearchErr(true);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const resetInput = () => {
    setId(null);
    setKeyword('');
    setKeywordImg(null);
    setCategory(KeywordCategory.Economics);
    resetContents();
    setNewsList([]);
  };

  const submit = async () => {
    if (id === null) return;
    setIsLoading(true);
    try {
      const result: boolean = await keywordRepositories.patchKeyword({
        id: id,
        keyword: keyword,
        category: category,
        keywordImage: keywordImg,
        explain: content,
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
    <ProtectedLayout>
      <Wrapper>
        <SearchBox setSearchWord={findKeyword} />
        <ContentWrapper state={id === null}>
          <InputWrapper>
            <InputTitle>키워드</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setKeyword(e.currentTarget.value);
              }}
            ></Input>
          </InputWrapper>
          <InputWrapper>
            <ImageUpload setImageUrl={setKeywordImg} />
          </InputWrapper>
          <TextEditor ref={ref} style={{ height: '600px' }} onChange={handleContents} />
          <ExplainPreview keyword={keyword} explain={content} />
          <InputWrapper>
            <InputTitle>카테고리</InputTitle>
            <Select
              className="form-select"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
          {/* <NewsSetter>
            <PrimaryButton
              title={'뉴스 선택하기'}
              click={() => {
                setIsSelectorModalUp(true);
              }}
            />
            <NewsWrapper>
              {(newsList ?? []).map((news) => {
                let curTitle: string | undefined = '';
                for (let newstitle of newsTitleList) {
                  if (newstitle.id === news.id) {
                    curTitle = newstitle.title;
                  }
                }
                return <NewsLi key={news.id}>{curTitle}</NewsLi>;
              })}
            </NewsWrapper>
          </NewsSetter> */}
          <SubmitWrapper>
            <PrimaryButton
              title="SUBMIT"
              click={() => {
                submit();
              }}
            />
          </SubmitWrapper>
          {/* <NewsSelect curNewsList={newsList} setCurNewsList={setNewsList}></NewsSelect> */}
        </ContentWrapper>
        <SearchState searchErr={keywordSearchErr} loading={isLoading} />
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
