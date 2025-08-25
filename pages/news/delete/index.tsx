import { Mutation } from '@suspensive/react-query';
import styled from 'styled-components';

import { useOpenNewsSearch } from '@/utils/hook/news/useOpenNewsSearch';
import { PrimaryButton } from '@components/common/button';
import ProtectedLayout from '@components/common/protectedLayout';
import SearchBox from '@components/keyword/search';
import { NewsOrg, NewsTitle } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

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
  const [deleteNews, setDeleteNews] = useState<NewsOrg | null>(null);

  const [openTrigger, setOpenTrigger] = useState<number>(0);

  const { open } = useOpenNewsSearch();

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);

  return (
    <ProtectedLayout>
      <Wrapper>
        <SearchBox
          key={openTrigger}
          setSearchWord={(word: string) => {
            open({
              searchWord: word,
              selectNews: (news) => {
                setDeleteNews(news);
              },
            });
          }}
        />
        <SelectWrapper>
          {deleteNews && (
            <Mutation
              key={openTrigger}
              mutationFn={async (id: number) => {
                setIsLoading(true);
                return newsRepositories.deleteNews(id);
              }}
              onSuccess={(_, __, context) => {
                alert('잘 감');
                setDeleteNews(null);
                setOpenTrigger((s) => s + 1);
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
                    <NewsLi>
                      <p className="title">{deleteNews.title}</p>
                      <p className="subTitle">{deleteNews.subTitle}</p>
                    </NewsLi>
                    <PrimaryButton
                      title="삭제하기"
                      click={() => {
                        if (!deleteNews.id || isLoading) return;
                        const response = window.confirm('정말로 삭제하시겠습니까?');
                        if (response) {
                          mutate(deleteNews.id);
                        }
                      }}
                    />
                  </SubmitWrapper>
                );
              }}
            </Mutation>
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

const NewsLi = styled.div`
  background-color: 'rgba(0,0,0,0)';
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  padding: 0.375rem 0.75rem;
  margin-bottom: 10px;

  p {
    display: block;
    margin: 0;
  }

  .title {
    font-size: 14px;
    color: black;
  }

  .subTitle {
    display: -webkit-box;
    font-size: 12px;
    color: rgb(100, 100, 100);
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SubmitWrapper = styled.div``;
