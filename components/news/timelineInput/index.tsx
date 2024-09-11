import { News, commentType } from '@interface/news';
import styled from 'styled-components';
import { useTimelineArr } from './timelineInput.hook';
import { Column, Row } from '@components/common/figure';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clone } from '@utils';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface TimelineInputProps {
  timeline: News['timeline'];
  handleTimeline: (timeline: News['timeline']) => void;
}

export default function TimelineInput({ timeline, handleTimeline }: TimelineInputProps) {
  const { addTimeline, deleteTimeline, moveTimelineLeft, moveTimelineRight } = useTimelineArr(
    timeline,
    handleTimeline,
  );

  const [curFocus, setCurFocus] = useState<number | null>(null);

  return (
    <Wrapper>
      <LayerTitleWrapper>
        <InputTitle>타임 라인</InputTitle>
      </LayerTitleWrapper>
      <RowLayer>
        <LeftWrapper>
          <LeftColumnLayer>
            {timeline.map((item, idx) => {
              return (
                <NewsInputLayer
                  $focus={idx === curFocus}
                  onClick={() => setCurFocus(curFocus === null ? idx : null)}
                  className="p-3"
                >
                  <p className="date">
                    {item.date}
                    {item.date === '' ? <span className="example">2024.01.01</span> : <></>}
                  </p>
                  <p className="title">
                    {item.title}{' '}
                    {item.title === '' ? <span className="example">예시 제목 입니다.</span> : <></>}
                  </p>
                </NewsInputLayer>
              );
            })}
          </LeftColumnLayer>
        </LeftWrapper>
        <RightWrapper>
          <RightColumnLayer>
            {curFocus !== null ? (
              <div className="input_layer_header">
                <div className="button_wrapper">
                  <Button className="btn btn-primary" onClick={() => addTimeline(curFocus)}>
                    {' '}
                    추가{' '}
                  </Button>
                  <Button className="btn btn-secondary" onClick={() => deleteTimeline(curFocus)}>
                    {' '}
                    삭제{' '}
                  </Button>
                </div>
                <div className="left-right-buttons">
                  <div className="left order-button" onClick={() => moveTimelineLeft(curFocus)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div className="right order-button" onClick={() => moveTimelineRight(curFocus)}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </div>
                <InputWrapper>
                  <SubInputTitle>날짜</SubInputTitle>
                  <DateInput
                    type="text"
                    className="form-control"
                    value={timeline[curFocus].date}
                    onChange={(e) => {
                      const curTimeline = clone(timeline);
                      curTimeline[curFocus].date = e.currentTarget.value;
                      handleTimeline(curTimeline);
                    }}
                  ></DateInput>
                </InputWrapper>
                <InputWrapper>
                  <SubInputTitle>제목</SubInputTitle>
                  <TitleInput
                    type="text"
                    className="form-control"
                    value={timeline[curFocus].title}
                    onChange={(e) => {
                      const curTimeline = clone(timeline);
                      curTimeline[curFocus].title = e.currentTarget.value;
                      handleTimeline(curTimeline);
                    }}
                  ></TitleInput>
                </InputWrapper>
              </div>
            ) : (
              <></>
            )}
          </RightColumnLayer>
        </RightWrapper>
      </RowLayer>
    </Wrapper>
  );
}

const Wrapper = styled(Column)``;

const Layer = styled.div`
  min-width: 300px;
  border: 0.8px solid rgb(200, 200, 200);
  border-radius: 20px;
  padding: 0.5rem;
`;

const LayerTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RowLayer = styled(Row)`
  height: 500px;
  flex: 0 1 auto;
`;

const LeftColumnLayer = styled(Column)`
  gap: 10px;
`;

const RightColumnLayer = styled.div``;

const LeftWrapper = styled(Layer)`
  overflow-y: scroll;
`;

const RightWrapper = styled(Layer)``;

const InputTitle = styled.div`
  flex: 1 0 auto;
  font-size: 16px;
  font-weight: bold;
  padding: 0 1rem;
  color: black;
`;

interface NewsInputLayerProps {
  $focus: boolean;
}

const NewsInputLayer = styled.div<NewsInputLayerProps>`
  min-width: 500px;

  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: ${({ $focus }) => ($focus ? 'rgb(200,200,200)' : 'white')};
  border: 0.8px solid rgb(200, 200, 200);
  border-radius: 20px;
  cursor: pointer;

  p {
    font-size: 14px;
    margin: 0;
    padding: 0;
  }

  .date {
    font-weight: 700;
  }

  .example {
    color: rgb(200, 200, 200);
  }

  div.input_layer_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    div.left-right-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      div.order-button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  div.button_wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const Button = styled.button``;

const SubInputTitle = styled.div`
  width: 40px;
  flex: 0 0 auto;
  font-size: 14px;
`;

const Input = styled.input``;

const SubInput = styled.input`
  width: 200px;
`;

const DateInput = styled.input`
  width: 110px;
`;

const TitleInput = styled.input``;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-top: 5px;
  padding-bottom: 5px;
`;
