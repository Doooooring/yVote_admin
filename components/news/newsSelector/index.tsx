import LoadingCommon from '@/components/common/loadingCommon';
import { CommonModalLayout } from '@/components/common/modal/component';
import { NewsOrg } from '@/interface/news';
import { getNewsListQueryOption } from '@/queryOption/news';
import { newsRepositories } from '@repositories/news';
import { ErrorBoundary } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { useMutation } from '@tanstack/react-query';
import { Suspense } from 'react';
import styled from 'styled-components';

export function NewsSelector({
  searchWord,
  selectNews,
  close,
}: {
  searchWord: string;
  selectNews: (news: NewsOrg) => void;
  close: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationKey: ['getNewsDetails'],
    mutationFn: (id: number) => newsRepositories.getNewsDetails(id),
    onSuccess: (data) => {
      selectNews(data);
      close();
    },
    onError: () => {
      alert('다시 시도해주세요');
    },
  });

  return (
    <CommonModalLayout onOutClick={close}>
      <ErrorBoundary fallback={<div>폴백인가??</div>}>
        <SelectWrapper>
          <Suspense fallback={<LoadingCommon fontColor="black" iconSize={48} />}>
            <SuspenseQuery {...getNewsListQueryOption({ searchWord })}>
              {({ data: newsSearchList }) => (
                <NewsUl>
                  {newsSearchList.map((news, idx) => {
                    return (
                      <NewsLi
                        key={idx}
                        onClick={() => {
                          mutate(news.id);
                        }}
                      >
                        <p className="title">{news.title}</p>
                        <p className="subTitle">{news.subTitle}</p>
                      </NewsLi>
                    );
                  })}
                </NewsUl>
              )}
            </SuspenseQuery>
          </Suspense>
        </SelectWrapper>
        {isPending && (
          <CommonModalLayout>
            <LoadingCommon fontColor="black" iconSize={48} />
          </CommonModalLayout>
        )}
      </ErrorBoundary>
    </CommonModalLayout>
  );
}

const SelectWrapper = styled.div`
  width: 50%;
  height: 400px;

  overflow: scroll;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NewsUl = styled.ul`
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
`;

const NewsLi = styled.li`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
  }
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
