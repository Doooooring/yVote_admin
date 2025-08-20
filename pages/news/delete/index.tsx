import { Mutation, SuspenseQuery } from '@suspensive/react-query';
import styled from 'styled-components';

import { getNewsListQueryOption } from '@/queryOption/news';
import { PrimaryButton } from '@components/common/button';
import ProtectedLayout from '@components/common/protectedLayout';
import SearchBox from '@components/keyword/search';
import { NewsTitle } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { Suspense, useCallback, useState } from 'react';

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
  const queryClient = useQueryClient();

  const [searchWord, setSearchWord] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);

  const deleteNews = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const response = await newsRepositories.deleteNews(id);
      if (!response) Error;
    } catch (e) {
      alert('잘 안감');
    }
    setIsLoading(false);
  }, []);

  return (
    <ProtectedLayout>
      <Wrapper>
        <SearchBox
          setSearchWord={(word: string) => {
            setSearchWord(word);
          }}
        />
        <SelectWrapper>
          {searchWord && (
            <Suspense>
              <SuspenseQuery {...getNewsListQueryOption({ searchWord })}>
                {({ data: newsList }) => {
                  return (
                    <>
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
                      <Mutation
                        mutationFn={async (id: number) => {
                          setIsLoading(true);
                          return newsRepositories.deleteNews(id);
                        }}
                        onSuccess={(_, __, context) => {
                          queryClient.invalidateQueries(getNewsListQueryOption({ searchWord }));
                          alert('잘 감');
                        }}
                        onError={() => {
                          alert('다시 해보셈');
                        }}
                        onSettled={() => {
                          setIsLoading(false);
                        }}
                      >
                        {({ mutate }) => {
                          return (
                            <SubmitWrapper>
                              <PrimaryButton
                                title="SUBMIT"
                                click={() => {
                                  if (!deleteId || isLoading) return;
                                  const response = window.confirm('정말로 삭제하시겠습니까?');
                                  if (response) {
                                    mutate(deleteId);
                                  }
                                }}
                              />
                            </SubmitWrapper>
                          );
                        }}
                      </Mutation>
                    </>
                  );
                }}
              </SuspenseQuery>
            </Suspense>
          )}
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
