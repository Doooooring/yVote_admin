import { News, Press } from '@interface/news';
import { clone } from '@utils';
import { useState } from 'react';
import styled from 'styled-components';

export default function NewsPost() {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [newsList, setNewsList] = useState<News['news']>([]);
  const [journals, setJournals] = useState<News['journals']>([]);
  const [state, setState] = useState<boolean>(true);
  const [opinions, setOpinions] = useState<News['opinions']>({
    left: '',
    right: '',
  });
  const [keywordList, setKeywordList] = useState<Array<string>>([]);

  return (
    <Wrapper>
      <ContentWrapper>
        <InputWrapper>
          <InputTitle>제목</InputTitle>
          <Input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <InputWrapper>
          <InputTitle>설명</InputTitle>
          <Input
            type="textarea"
            className="form-control"
            placeholder="의도적으로 줄 넘기고 싶으면 $ 넣기"
            value={summary}
            onChange={(e) => {
              setSummary(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <NewsInputWrapper>
          <InputTitle>관련 뉴스</InputTitle>
          {newsList.map((news, idx) => {
            return (
              <NewsInputLayer key={idx}>
                <InputWrapper>
                  <InputTitle>날짜</InputTitle>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="xxxx.xx 형식으로 넣으세요"
                    value={news.date}
                    onChange={(e) => {
                      const curNewsList = clone(newsList);
                      curNewsList[idx].date = e.currentTarget.value;
                      setNewsList(curNewsList);
                    }}
                  ></Input>
                </InputWrapper>
                <InputWrapper>
                  <InputTitle>링크</InputTitle>
                  <Input
                    type="text"
                    className="form-control"
                    value={news.link}
                    onChange={(e) => {
                      const curNewsList = clone(newsList);
                      curNewsList[idx].link = e.currentTarget.value;
                      setNewsList(curNewsList);
                    }}
                  ></Input>
                </InputWrapper>
                <InputWrapper>
                  <InputTitle>제목</InputTitle>
                  <Input
                    type="text"
                    className="form-control"
                    value={news.title}
                    onChange={(e) => {
                      const curNewsList = clone(newsList);
                      curNewsList[idx].title = e.currentTarget.value;
                      setNewsList(curNewsList);
                    }}
                  ></Input>
                </InputWrapper>
              </NewsInputLayer>
            );
          })}
        </NewsInputWrapper>
        <JournalsWrapper>
          <InputTitle>저널</InputTitle>
          {journals.map((journal, idx) => {
            return (
              <JournalLayer key={idx}>
                <InputWrapper>
                  <InputTitle>언론사</InputTitle>
                  <Select
                    className="form-select"
                    value={journal.press}
                    onChange={(e) => {
                      const curJournals = clone(journals);
                      curJournals[idx].press = e.currentTarget.value as Press;
                      setJournals(curJournals);
                    }}
                  >
                    <option value="조선">조선</option>
                    <option value="중앙">중앙</option>
                    <option value="동아">동아</option>
                    <option value="한겨레">한겨레</option>
                    <option value="한경">한경</option>
                    <option value="매경">매경</option>
                  </Select>
                </InputWrapper>
                <InputWrapper>
                  <InputTitle>링크</InputTitle>
                  <Input
                    type="text"
                    className="form-control"
                    value={journal.link}
                    onChange={(e) => {
                      const curJournals = clone(journals);
                      curJournals[idx].link = e.currentTarget.value;
                      setJournals(curJournals);
                    }}
                  ></Input>
                </InputWrapper>
                <InputWrapper>
                  <InputTitle>제목</InputTitle>
                  <Input
                    type="text"
                    className="form-control"
                    value={journal.title}
                    onChange={(e) => {
                      const curJournals = clone(journals);
                      curJournals[idx].title = e.currentTarget.value;
                      setJournals(curJournals);
                    }}
                  ></Input>
                </InputWrapper>
              </JournalLayer>
            );
          })}
        </JournalsWrapper>
        <InputWrapper>
          <InputTitle>상태</InputTitle>
          <Select
            className="form-control"
            value={state === true ? '최신' : '구닥다리'}
            onChange={(e) => {
              if (e.currentTarget.value === 'true') {
                setState(true);
              } else {
                setState(false);
              }
            }}
          >
            <option value={'true'}>최신</option>
            <option value={'false'}>구닥다리</option>
          </Select>
        </InputWrapper>
        <InputWrapper>
          <InputTitle>의견</InputTitle>
          <InputWrapper>
            <InputTitle>왼쪽</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={opinions.left}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.left = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>
          </InputWrapper>
          <InputWrapper>
            <InputTitle>오른쪽</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={opinions.right}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.right = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>
          </InputWrapper>
        </InputWrapper>
      </ContentWrapper>
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

const ContentWrapper = styled.div`
  width: 50%;
  min-width: 60rem;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const InputTitle = styled.div`
  width: 100px;
  font-size: 18px;
`;

const Input = styled.input``;

const NewsInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewsInputLayer = styled.div`
  display: flex;
  flex-direction: row;
`;

const JournalsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const JournalLayer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Select = styled.select``;
