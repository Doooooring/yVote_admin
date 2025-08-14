import { complexClone } from '@/utils';
import { useArr } from '@/utils/hook/useArr';
import { getCommentRest } from '@/utils/news';
import { Center, Column, Row } from '@components/common/figure';
import ListEditView from '@components/common/listEditView';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { commentType } from '@interface/news';
import { useNewsStore } from '@store/news';
import styled from 'styled-components';

interface CommentInputProps {
  comments: commentType[];
  setComments: (v: commentType[]) => void;
}

// const getCommentRest = (comments: CommentsArr[]) => {
//   const curComments = comments;
//   let restComment: commentType[] = [];
//   commentTypeKey.forEach((commentType) => {
//     const result = curComments.filter((comment) => {
//       return comment.type === commentType;
//     });
//     if (result.length === 0) {
//       restComment.push(commentType);
//     }
//   });
//   return restComment;
// };

export default function CommentInput({ comments, setComments }: CommentInputProps) {
  const {
    curFocus,
    setCurFocus,
    addArr: addComments,
    deleteArr: deleteComments,
    moveArrLeft: moveCommentLeft,
    moveArrRight: moveCommentRight,
  } = useArr(comments, setComments, () => {
    const curType = getCommentRest(comments)[0];
    return curType;
  });

  const setCommentSelected = useNewsStore((state) => state.setCommentSelected);

  return (
    <ListEditView
      title="평론"
      isRightOpen={curFocus !== null}
      listView={
        <>
          {comments.map((comment, idx) => {
            return (
              <CommentListLayer
                $focus={curFocus == idx}
                onClick={() => setCurFocus(curFocus === idx ? null : idx)}
                key={idx}
                className="p-3"
              >
                <p className="title_d">평론 타입</p>
                <p className="title">{comment} </p>
              </CommentListLayer>
            );
          })}
          {comments.length == 0 ? (
            <VacantInputLayer $focus={false} onClick={() => addComments(0)}>
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
                <OrderButton onClick={() => moveCommentLeft(curFocus!)}>
                  <FontAwesomeIcon icon={faChevronUp} width="12px" />
                </OrderButton>
                <OrderButton onClick={() => moveCommentRight(curFocus!)}>
                  <FontAwesomeIcon icon={faChevronDown} width="12px" />
                </OrderButton>
              </UpdowButtonWrapper>
              <AddDelButtonWrapper>
                {getCommentRest(comments).length == 0 ? (
                  <></>
                ) : (
                  <Button className="btn btn-primary" onClick={() => addComments(curFocus!)}>
                    {' '}
                    추가{' '}
                  </Button>
                )}
                <Button className="btn btn-secondary" onClick={() => deleteComments(curFocus!)}>
                  {' '}
                  삭제{' '}
                </Button>
              </AddDelButtonWrapper>
            </InputLayerHeader>
            <CommentSelect
              className="form-select"
              value={comments[curFocus]}
              onChange={(e) => {
                const curComments = complexClone(comments);
                curComments[curFocus] = e.currentTarget.value as commentType;
                setComments(curComments);
              }}
            >
              {[comments[curFocus], ...getCommentRest(comments)].map((comment, idx) => {
                return (
                  <option key={comment + JSON.stringify(idx)} value={comment}>
                    {comment}
                  </option>
                );
              })}
            </CommentSelect>
            <div
              className="comment-modal-button btn btn-primary"
              onClick={() => setCommentSelected(comments[curFocus])}
            >
              내용 채우기
            </div>
          </RightColumnLayer>
        ) : (
          <></>
        )
      }
    />
  );
}

const CommentSelect = styled.select`
  width: 200px;
  margin: 1rem 0;
`;

interface NewsInputLayerProps {
  $focus: boolean;
}

const RightColumnLayer = styled.div`
  div.input_layer_header {
    display: flex;
    flex-direction: row;
  }
`;

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

interface CommentListLayerProps {
  $focus: boolean;
}

const CommentListLayer = styled.div<CommentListLayerProps>`
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

  .title_d {
    font-weight: 600;
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
  width: 440px;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  height: 40px;
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
