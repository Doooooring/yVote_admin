import styled from 'styled-components';

import Modal from '@components/common/modal';

import { useNewsStore } from '@store/news';
import { useEffect, useState } from 'react';

import { News } from '@interface/news';
import { useCommonStore } from '@store/common';

import { TfiLoop } from 'react-icons/tfi';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}

interface NewsSelectProps {
  curNewsList: Array<number>;
  setCurNewsList: (curList: Array<number>) => void;
}

export default function NewsSelect({ curNewsList, setCurNewsList }: NewsSelectProps) {
  const [newsRest, setNewsRest] = useState<Array<NewsTitle>>([]);
  const [newsContain, setNewsContain] = useState<Array<NewsTitle>>([]);

  const [restSelected, setRestSelected] = useState<Array<NewsTitle>>([]);
  const [containSelected, setContainSelected] = useState<Array<NewsTitle>>([]);

  const newsTitleList = useNewsStore((store) => store.newsTitleList);
  const setIsModalUp = useNewsStore((store) => store.setIsModalup);

  const isLoading = useCommonStore((store) => store.isLoading);
  const setIsLoading = useCommonStore((store) => store.setIsLoading);

  useEffect(() => {
    console.log(newsTitleList);
    const curRest: Array<NewsTitle> = [];
    const curContain: Array<NewsTitle> = [];
    newsTitleList.forEach((news) => {
      if (curNewsList.includes(news.order!)) {
        curContain.push(news);
      } else {
        curRest.push(news);
      }
    });
    setNewsRest(curRest);
    setNewsContain(curContain);
  }, []);

  function clickRest(news: NewsTitle) {
    if (restSelected.includes(news)) {
      setRestSelected(
        restSelected.filter((rest) => {
          rest._id != news._id;
        }),
      );
      return;
    }
    setRestSelected([...restSelected, news]);
  }

  function clickContain(news: NewsTitle) {
    if (containSelected.includes(news)) {
      setContainSelected(
        restSelected.filter((contain) => {
          contain._id != news._id;
        }),
      );
      return;
    }
    setContainSelected([...containSelected, news]);
  }

  function reBuild() {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const newRest = [];
    const newContain = [];
    newsTitleList.map((news) => {
      if (newsRest.includes(news)) {
        if (restSelected.includes(news)) {
          newContain.push(news);
        } else {
          newRest.push(news);
        }
      } else {
        if (containSelected.includes(news)) {
          newsRest.push(news);
        } else {
          newContain.push(news);
        }
      }
    });
    setNewsRest(newsRest);
    setNewsContain(newsContain);
    setIsLoading(false);
  }

  return (
    <Modal>
      <Wrapper>
        <NewsGrid>
          <NewsUl>
            {newsRest.map((news) => {
              return (
                <NewsLi
                  key={news._id}
                  onClick={() => {
                    clickRest(news);
                  }}
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
          <TfiLoop />
        </ButtonWrapper>
        <NewsGrid>
          <NewsUl>
            {newsContain.map((news) => {
              return (
                <NewsLi
                  key={news._id}
                  onClick={() => {
                    clickContain(news);
                  }}
                >
                  {news.title}
                </NewsLi>
              );
            })}
          </NewsUl>
        </NewsGrid>
        <SaveButton
          onClick={() => {
            setCurNewsList(newsContain.map((news) => news.order!));
            setIsModalUp(false);
          }}
        ></SaveButton>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div``;

const NewsGrid = styled.div``;

const NewsUl = styled.ul``;

const NewsLi = styled.li``;

const ButtonWrapper = styled.div``;

const SaveButton = styled.button``;
