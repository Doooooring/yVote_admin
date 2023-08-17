import SearchBox from '@components/keyword/search';
import { NewsTitle, newsRepositories } from '@repositories/news';
import { GetServerSideProps } from 'next';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

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

export default function NewsImage({ data }: pageProps) {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [newsSearchList, setNewsSearchList] = useState<NewsTitle[]>([]);
  const [newsSearchErr, setNewsSearchErr] = useState<boolean>(false);
  const [newsSelectorUp, setNewsSelectorup] = useState<boolean>(false);

  const findNews = useCallback(async (searchWord: string) => {
    try {
      setIsLoading(true);
      const response = await newsRepositories.getNewsTitles(searchWord);
      if (response.length == 0) {
        Error;
      } else {
        setNewsSearchList(response);
        setNewsSelectorup(true);
        setIsLoading(false);
      }
      return true;
    } catch {
      setTitle('');
      setNewsSearchErr(true);
      setIsLoading(false);

      return false;
    }
  }, []);
  return (
    <Wrapper>
      <SearchBox findKeyword={findNews} />
      <div className="select-wrapper">
        <ul className="news-ul">
          {newsSearchList.map((news, idx) => {
            return (
              <li
                className="news-li"
                key={idx}
                onClick={async () => {
                  setId(news._id!);
                }}
              >
                {news.title}
              </li>
            );
          })}
        </ul>
      </div>
      {id ? <div></div> : <></>}
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
