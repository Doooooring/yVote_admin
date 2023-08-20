import { HOST_URL } from '@asset';
import { SubmitButton } from '@components/common/button';
import ImageFallback from '@components/common/imgFallback';
import SearchBox from '@components/keyword/search';
import { keywordRepositories, KeywordTitle } from '@repositories/keyword';
import { GetServerSideProps } from 'next';
import { ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';

interface pageProps {
  data: {
    keywordTitles: Array<KeywordTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const keywordTitles: Array<KeywordTitle> = await keywordRepositories.getKeywordTitles('');
  return {
    props: {
      data: {
        keywordTitles,
      },
    },
  };
};

export default function KeywordImage({ data }: pageProps) {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [curFile, setCurFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [keywordSearchList, setKeywordSearchList] = useState<KeywordTitle[]>([]);
  const [keywordSearchErr, setKeywordSearchErr] = useState<boolean>(false);
  const [keywordSelectorUp, setKeywordSelectorUp] = useState<boolean>(false);

  const findKeywords = useCallback(async (searchWord: string) => {
    try {
      setIsLoading(true);
      const response = await keywordRepositories.getKeyword(searchWord);
      if (!response) {
        Error;
        return false;
      } else {
        const { _id, keyword } = response;
        setId(_id);
        setTitle(keyword);
        setKeywordSelectorUp(true);
        setIsLoading(false);
      }
      return true;
    } catch {
      setTitle('');
      setKeywordSearchErr(true);
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
      const response = await keywordRepositories.postImage(id, curFile);
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
      <SearchBox findKeyword={findKeywords} />
      {/* <div
        className="select-wrapper"
        style={{
          display: keywordSelectorUp ? 'block' : 'none',
        }}
      >
        <ul className="keyword-ul">
          {keywordSearchList.map((keyword, idx) => {
            return (
              <li
                className="keyword-li"
                key={idx}
                onClick={async () => {
                  setId(keyword._id!);
                  setKeywordSelectorUp(false);
                }}
              >
                {keyword.keyword}
              </li>
            );
          })}
        </ul>
      </div> */}
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
          <div className="imgWrapper">
            <ImageFallback src={`${HOST_URL}/images/keyword/${id}`} />
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
    ul.keyword-ul {
      list-style-type: none;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      padding: 0.375rem 0.75rem;
      li.keyword-li {
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
