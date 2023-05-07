import styled from 'styled-components';

import Modal from '@components/common/modal';

import { useNewsStore } from '@store/news';
import { useEffect, useState } from 'react';

import { News } from '@interface/news';
import { useCommonStore } from '@store/common';

import { SubmitButton } from '@components/common/button';
import Loader from '@components/common/loader';
import { TfiLoop } from 'react-icons/tfi';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}

interface NewsSelectProps {
  curNewsList: Array<string>;
  setCurNewsList: (curList: Array<string>) => void;
}

export default function NewsSelect({ curNewsList, setCurNewsList }: NewsSelectProps) {
  const [newsRest, setNewsRest] = useState<Array<NewsTitle>>([]);
  const [newsContain, setNewsContain] = useState<Array<NewsTitle>>([]);

  const [restSelected, setRestSelected] = useState<Array<NewsTitle>>([]);
  const [containSelected, setContainSelected] = useState<Array<NewsTitle>>([]);

  const newsTitleList = useNewsStore((store) => store.newsTitleList);
  const setIsModalUp = useCommonStore((store) => store.setIsModalup);

  const isLoading = useCommonStore((store) => store.isLoading);
  const setIsLoading = useCommonStore((store) => store.setIsLoading);

  useEffect(() => {
    const curRest: Array<NewsTitle> = [];
    const curContain: Array<NewsTitle> = [];
    newsTitleList.forEach((news) => {
      if (curNewsList.includes(news._id!)) {
        curContain.push(news);
      } else {
        curRest.push(news);
      }
    });
    setNewsRest(curRest);
    setNewsContain(curContain);
  }, [newsTitleList]);

  function clickRest(news: NewsTitle) {
    if (restSelected.includes(news)) {
      setRestSelected(
        restSelected.filter((rest) => {
          return rest._id != news._id;
        }),
      );
      return;
    }
    setRestSelected([...restSelected, news]);
  }

  function clickContain(news: NewsTitle) {
    if (containSelected.includes(news)) {
      setContainSelected(
        containSelected.filter((contain) => {
          return contain._id != news._id;
        }),
      );
      return;
    }
    setContainSelected([...containSelected, news]);
  }

  function reBuild() {
    if (isLoading) {
      console.log('is loading');
      return;
    }
    setIsLoading(true);
    const newRest: Array<NewsTitle> = [];
    const newContain: Array<NewsTitle> = [];
    newsTitleList.map((news) => {
      if (newsRest.includes(news)) {
        if (restSelected.includes(news)) {
          newContain.push(news);
        } else {
          newRest.push(news);
        }
      } else {
        if (containSelected.includes(news)) {
          newRest.push(news);
        } else {
          newContain.push(news);
        }
      }
    });
    setNewsRest(newRest);
    setNewsContain(newContain);
    setContainSelected([]);
    setRestSelected([]);
    setIsLoading(false);
  }

  return (
    <Modal>
      <Wrapper>
        <NewsGrid>
          <h3>전체 리스트</h3>
          <NewsUl>
            {newsRest.map((news) => {
              return (
                <NewsLi
                  key={news._id}
                  onClick={() => {
                    clickRest(news);
                  }}
                  state={restSelected.includes(news)}
                >
                  {news.title}
                </NewsLi>
              );
            })}
          </NewsUl>
        </NewsGrid>
        <ButtonWrapper
          onClick={() => {
            reBuild();
          }}
        >
          <TfiLoop className="reload" />
        </ButtonWrapper>
        <NewsGrid>
          <h3>선택 리스트</h3>
          <NewsUl>
            {newsContain.map((news) => {
              return (
                <NewsLi
                  key={news._id}
                  onClick={() => {
                    clickContain(news);
                  }}
                  state={containSelected.includes(news)}
                >
                  {news.title}
                </NewsLi>
              );
            })}
          </NewsUl>
          <Loader />
        </NewsGrid>
        <SubmitWrapper>
          <SubmitButton
            title={'선택 완료'}
            click={() => {
              setIsModalUp(false);
              setCurNewsList(newsContain.map((news) => news._id!));
            }}
          ></SubmitButton>
        </SubmitWrapper>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  width: 800px;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
`;

const NewsGrid = styled.div`
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

interface newsLiProps {
  state: boolean;
}

const NewsLi = styled.li<newsLiProps>`
  background-color: ${({ state }) => (state ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')};
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
  }
  padding: 0.375rem 0.75rem;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  padding-top: 30px;
  padding-bottom: 20px;
  & > svg {
    width: 30px;
    height: 30px;
  }
  &:hover {
    cursor: pointer;
  }
`;

const SubmitWrapper = styled.div`
  padding-top: 30px;
`;
