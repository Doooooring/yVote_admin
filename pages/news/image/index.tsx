import { SubmitButton } from '@components/common/button';
import SearchBox from '@components/keyword/search';
import { NewsTitle, newsRepositories } from '@repositories/news';
import { GetServerSideProps } from 'next';
import { ChangeEvent, useCallback, useState } from 'react';
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
  const [curFile, setCurFile] = useState<File | null>(null);

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

  const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const curTarget = e.currentTarget.files;
    if (curTarget) {
      console.log(curTarget);
      setCurFile(curTarget[0]);
    } else {
      setCurFile(null);
    }
  };

  const submit = async () => {
    if (curFile === null) {
      alert('이미지를 먼저 넣어주세요');
      return;
    }
    try {
      const response = await newsRepositories.postImage(id, curFile);
      if (response) {
        alert('잘갔네요');
        setId('');
        setCurFile(null);
      } else {
        Error();
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  return (
    <Wrapper>
      <SearchBox findKeyword={findNews} />
      <div
        className="select-wrapper"
        style={{
          display: newsSelectorUp ? 'block' : 'none',
        }}
      >
        <ul className="news-ul">
          {newsSearchList.map((news, idx) => {
            return (
              <li
                className="news-li"
                key={idx}
                onClick={async () => {
                  setId(news._id!);
                  setNewsSelectorup(false);
                }}
              >
                {news.title}
              </li>
            );
          })}
        </ul>
      </div>
      {id ? (
        <div>
          <div className="img-file">
            <InputTitle>이미지</InputTitle>
            <input
              type="file"
              className="form-control"
              onChange={(e) => {
                fileChange(e);
              }}
            ></input>
          </div>
          <div>
            <SubmitButton
              title="SUBMIT"
              click={() => {
                if (isLoading) return;
                submit();
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
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
  div.select-wrapper {
    width: 50%;
    max-height: 400px;
    overflow: scroll;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
    ul.news-ul {
      list-style-type: none;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      padding: 0.375rem 0.75rem;
      li.new-li {
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.5);
        }
        padding: 0.375rem 0.75rem;
        margin-bottom: 10px;
      }
    }
  }
`;

const InputTitle = styled.div`
  width: 100px;
  font-size: 18px;
  font-weight: bold;
`;
