import { NewsTitle } from '@interface/news';
import styled from 'styled-components';

export default function IdSelector({
  newsSearchList,
  getNews,
  newsSelectorUp,
  setNewsSelectorUp,
}: {
  newsSearchList: Array<NewsTitle>;
  getNews: (id: number) => Promise<void>;
  newsSelectorUp: boolean;
  setNewsSelectorUp: (state: boolean) => void;
}) {
  return (
    <Wrapper
      state={newsSelectorUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setNewsSelectorUp(false);
        }
      }}
    >
      <SelectWrapper>
        <NewsUl>
          {newsSearchList.map((news, idx) => {
            return (
              <NewsLi
                key={idx}
                onClick={async () => {
                  await getNews(news.id);
                  setNewsSelectorUp(false);
                }}
              >
                {news.title}
              </NewsLi>
            );
          })}
        </NewsUl>
      </SelectWrapper>
    </Wrapper>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100vw;
  height: 100vh;
  display: ${({ state }) => (state ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
  padding-bottom: 50px;
  z-index: 999;
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
`;
