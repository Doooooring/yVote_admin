import styled from 'styled-components';

import { SubmitButton } from '@components/common/button';
import ProtectedLayout from '@components/common/protectedLayout';
import SearchBox from '@components/keyword/search';
import { NewsTitle } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { GetServerSideProps } from 'next';
import { useCallback, useState } from 'react';

export interface NewsToDelete {
  id: string;
}

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const newsTitles: Array<NewsTitle> = await newsRepositories.getNewsTitles('');

  return {
    props: {
      data: {
        newsTitles,
      },
    },
  };
};

export default function NewsDelete({ data }: pageProps) {
  const [newsList, setNewsList] = useState<NewsTitle[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);

  const findNews = useCallback(async (searchWord: string) => {
    try {
      setIsLoading(true);
      const response = await newsRepositories.getNewsTitles(searchWord);
      if (response.length == 0) {
        Error;
      } else {
        setNewsList(response);
      }
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteNews = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const response = await newsRepositories.deleteNews(id);
        if (!response) Error;
        setNewsList([]);
        setDeleteId(null);
      } catch (e) {
        alert('잘 안감');
      }
      setIsLoading(false);
    },
    [deleteId],
  );

  return (
    <ProtectedLayout>
      <Wrapper>
        {/* <div className="delete-all">
        <div
          className="btn btn-primary"
          onClick={() => {
            newsRepositories.deleteNewsAll();
          }}
        >
          전체 삭제
        </div>
      </div> */}
        <SearchBox findKeyword={findNews} />
        <SelectWrapper>
          <NewsUl>
            {newsList.map((news, idx) => {
              return (
                <NewsLi
                  key={idx}
                  state={deleteId === news.id}
                  onClick={async () => {
                    setDeleteId(news.id);
                  }}
                >
                  {news.title}
                </NewsLi>
              );
            })}
          </NewsUl>
          <SubmitWrapper>
            <SubmitButton
              title="SUBMIT"
              click={async () => {
                if (isLoading || !deleteId) return;
                await deleteNews(deleteId);
              }}
            />
          </SubmitWrapper>
        </SelectWrapper>
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
