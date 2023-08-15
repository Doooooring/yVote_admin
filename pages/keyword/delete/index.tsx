import styled from 'styled-components';

import { SubmitButton } from '@components/common/button';
import SearchBox from '@components/keyword/search';
import { KeywordTitle, keywordRepositories } from '@repositories/keyword';
import { NewsTitle } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { GetServerSideProps } from 'next';
import { useCallback, useState } from 'react';

export interface NewsToDelete {
  _id: string;
}

interface pageProps {
  data: {
    keywordTitles: Array<NewsTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const keywordTitles: Array<NewsTitle> = await keywordRepositories.getKeywordTitles('');

  return {
    props: {
      data: {
        keywordTitles,
      },
    },
  };
};

export default function NewsDelete({ data }: pageProps) {
  const [keywordList, setKeywordList] = useState<KeywordTitle[]>([]);
  const [deleteId, setDeleteId] = useState<string>('');

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);
  const findKeyword = useCallback(async (searchWord: string) => {
    try {
      setIsLoading(true);
      const response = await keywordRepositories.getKeywordTitles(searchWord);
      if (response.length == 0) {
        Error;
      } else {
        setKeywordList(response);
        setIsLoading(false);
      }
      return true;
    } catch {
      setIsLoading(false);
      console.log('is here');
      return false;
    }
  }, []);

  const deleteKeyword = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await keywordRepositories.deleteKeyword(deleteId);
      if (!response) Error;
      setKeywordList([]);
      setDeleteId('');
      setIsLoading(false);
    } catch (e) {
      alert('잘 안감');
      setIsLoading(false);
    }
  }, [deleteId]);

  return (
    <Wrapper>
      <div className="delete-all">
        <div className="btn btn-primary" onClick={() => keywordRepositories.deleteKeywordAll()}>
          전체 삭제
        </div>
      </div>
      <SearchBox findKeyword={findKeyword} />
      <SelectWrapper>
        <NewsUl>
          {keywordList.map((keyword, idx) => {
            return (
              <NewsLi
                key={idx}
                state={deleteId === keyword._id}
                onClick={async () => {
                  setDeleteId(keyword._id!);
                }}
              >
                {keyword.keyword}
              </NewsLi>
            );
          })}
        </NewsUl>
        <SubmitWrapper>
          <SubmitButton
            title="SUBMIT"
            click={async () => {
              if (isLoading) return;
              await deleteKeyword();
            }}
          />
        </SubmitWrapper>
      </SelectWrapper>
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

const SelectWrapper = styled.div`
  width: 50%;
  max-height: 400px;
  overflow: scroll;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
`;

const NewsUl = styled.ul`
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
`;

interface NewsLi {
  state: boolean;
}

const NewsLi = styled.li<NewsLi>`
  background-color: ${({ state }) => (state ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')};
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
  }
  padding: 0.375rem 0.75rem;
  margin-bottom: 10px;
`;

const SubmitWrapper = styled.div``;
