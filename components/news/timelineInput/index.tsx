import { Center, Column, Row } from '@components/common/figure';
import ListEditView from '@components/common/listEditView';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TimelineToEdit } from '@interface/news';
import { complexClone } from '@utils';
import { useArr } from '@utils/hook/useArr';
import { getDotDateForm, getStandardDateForm } from '@utils/tools';
import styled from 'styled-components';

interface TimelineInputProps {
  timeline: TimelineToEdit[];
  handleTimeline: (timeline: TimelineToEdit[]) => void;
}

export default function TimelineInput({ timeline, handleTimeline }: TimelineInputProps) {
  const {
    curFocus,
    setCurFocus,
    addArr: addTimeline,
    deleteArr: deleteTimeline,
    moveArrLeft: moveTimelineLeft,
    moveArrRight: moveTimelineRight,
  } = useArr(timeline, handleTimeline, () => {
    return { title: '' };
  });
  return (
    <ListEditView
      title="타임라인"
      isRightOpen={curFocus !== null}
      listView={
        <>
          {timeline.map((item, idx) => {
            return (
              <NewsInputLayer
                id={`timeline-${idx}`}
                $focus={idx === curFocus}
                onClick={() => setCurFocus(curFocus === idx ? null : idx)}
                className="p-3"
              >
                <p className="date">
                  {item.date ? (
                    getDotDateForm(item.date)
                  ) : (
                    <span className="example">2024.01.01</span>
                  )}
                </p>
                <p className="title">
                  {item.title}{' '}
                  {item.title === '' ? <span className="example">예시 제목 입니다.</span> : <></>}
                </p>
              </NewsInputLayer>
            );
          })}
          {timeline.length == 0 ? (
            <VacantInputLayer $focus={false} onClick={() => addTimeline(0)}>
              <div className="row_layer">
                <div className="plus">+</div>
              </div>
            </VacantInputLayer>
          ) : (
            <></>
          )}
        </>
      }
      editView={
        curFocus != null ? (
          <RightColumnLayer>
            <InputLayerHeader>
              <UpdowButtonWrapper>
                <OrderButton onClick={() => moveTimelineLeft(curFocus!)}>
                  <FontAwesomeIcon icon={faChevronUp} width="12px" />
                </OrderButton>
                <OrderButton onClick={() => moveTimelineRight(curFocus!)}>
                  <FontAwesomeIcon icon={faChevronDown} width="12px" />
                </OrderButton>
              </UpdowButtonWrapper>
              <AddDelButtonWrapper>
                <Button className="btn btn-primary" onClick={() => addTimeline(curFocus!)}>
                  {' '}
                  추가{' '}
                </Button>
                <Button className="btn btn-secondary" onClick={() => deleteTimeline(curFocus!)}>
                  {' '}
                  삭제{' '}
                </Button>
              </AddDelButtonWrapper>
            </InputLayerHeader>

            <InputWrapper>
              <SubInputTitle>날짜</SubInputTitle>
              <DateInput
                type="date"
                className="form-control"
                value={
                  timeline[curFocus!].date ? getStandardDateForm(timeline[curFocus!].date!) : ''
                }
                onChange={(e) => {
                  const curTimeline = complexClone(timeline);
                  curTimeline[curFocus!].date = new Date(e.currentTarget.value);
                  handleTimeline(curTimeline);
                }}
                onClick={(e) => {
                  if (e.currentTarget.showPicker) {
                    e.currentTarget.showPicker();
                  }
                }}
              />
            </InputWrapper>
            <InputWrapper>
              <SubInputTitle>제목</SubInputTitle>
              <TitleInput
                type="text"
                className="form-control"
                value={timeline[curFocus!].title}
                onChange={(e) => {
                  const curTimeline = complexClone(timeline);
                  curTimeline[curFocus!].title = e.currentTarget.value;
                  handleTimeline(curTimeline);
                }}
              ></TitleInput>
            </InputWrapper>
          </RightColumnLayer>
        ) : (
          <></>
        )
      }
    />
  );
}

const Layer = styled.div`
  min-width: 300px;
  border: 0.8px solid rgb(200, 200, 200);
  border-radius: 20px;
  padding: 1rem;
`;

const RightColumnLayer = styled.div`
  div.input_layer_header {
    display: flex;
    flex-direction: row;
  }
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
  border: 0.8px solid rgb(170, 170, 170);
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
    color: ${({ $focus }) => ($focus ? 'white' : 'rgb(200, 200, 200)')};
  }

  div.button_wrapper {
  }
`;

const VacantInputLayer = styled(NewsInputLayer)`
  .row_layer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }

  .plus {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;

const InputLayerHeader = styled(Row)`
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  height: 40px;
`;

const SubInputTitle = styled.div`
  width: 40px;
  flex: 0 0 auto;
  font-size: 14px;
`;

const DateInput = styled.input`
  width: 150px;
`;

const TitleInput = styled.input`
  width: 400px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-top: 5px;
  padding-bottom: 5px;
`;

const UpdowButtonWrapper = styled(Column)`
  gap: 10px;
`;

const AddDelButtonWrapper = styled(Row)`
  gap: 10px;
  margin-bottom: 10px;
`;

const OrderButton = styled(Center)`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border: 2px solid rgb(150, 150, 150);
  cursor: pointer;
`;
