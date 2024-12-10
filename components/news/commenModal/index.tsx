import { CommentsArr, CommentToEdit, commentType } from '@interface/news';
import { useNewsStore } from '@store/news';
import { changeItemsOrder, clone } from '@utils';
import styled from 'styled-components';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useArr } from '@utils/hook/useArr';
import { comment } from '@uiw/react-md-editor';
import { useCallback, useMemo } from 'react';
import ListEditView from '@components/common/listEditView';

import { Row, Center, Column } from '@components/common/figure';
import CommonModal from '@components/common/comonModal';

interface CommentModalProps {
  editComment: (v: CommentsArr) => void;
}

export default function CommentModal({ editComment }: CommentModalProps) {
  const [commentSelected, setCommentSelected] = useNewsStore((state) => [
    state.commentSelected,
    state.setCommentSelected,
  ]);

  return (
    <CommonModal
      state={commentSelected !== null}
      outClickAction={() => {
        setCommentSelected(null);
      }}
    >
      <ModalBody editComment={editComment} />
    </CommonModal>
  );
}

function ModalBody({ editComment }: CommentModalProps) {
  const [commentSelected] = useNewsStore((state) => [state.commentSelected]);

  const commentArr = useMemo(() => {
    return commentSelected?.data ?? [];
  }, [commentSelected]);

  const setCommentArr = useCallback(
    (arr: CommentToEdit[]) => {
      if (!commentSelected) return;
      editComment({
        type: commentSelected?.type,
        data: arr,
      });
    },
    [commentSelected, editComment],
  );

  const {
    curFocus,
    setCurFocus,
    addArr: addComments,
    deleteArr: deleteComments,
    moveArrLeft: moveCommentUp,
    moveArrRight: moveCommentDown,
  } = useArr(commentArr, setCommentArr, () => {
    return { order: -1, title: '', comment: '', commentType: commentSelected?.type! };
  });

  return (
    <ContentWrapper>
      <ListEditView
        title={`${commentSelected?.type} 평론 수정`}
        isRightOpen={curFocus !== null}
        listView={
          <>
            {commentArr?.map((item, idx) => {
              return (
                <CommentInputLayer
                  id={`comment-${idx}`}
                  key={idx}
                  $focus={idx === curFocus}
                  onClick={() => setCurFocus(curFocus === idx ? null : idx)}
                  className="p-3"
                >
                  <p className="title">
                    {item.title}{' '}
                    {item.title === '' ? <span className="example">예시 제목 입니다.</span> : <></>}
                  </p>
                </CommentInputLayer>
              );
            })}
            {commentArr.length == 0 ? (
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
                  <OrderButton onClick={() => moveCommentUp(curFocus!)}>
                    <FontAwesomeIcon icon={faChevronUp} width="12px" />
                  </OrderButton>
                  <OrderButton onClick={() => moveCommentDown(curFocus!)}>
                    <FontAwesomeIcon icon={faChevronDown} width="12px" />
                  </OrderButton>
                </UpdowButtonWrapper>
                <AddDelButtonWrapper>
                  <Button className="btn btn-primary" onClick={() => addComments(curFocus!)}>
                    {' '}
                    추가{' '}
                  </Button>
                  <Button className="btn btn-secondary" onClick={() => deleteComments(curFocus!)}>
                    {' '}
                    삭제{' '}
                  </Button>
                </AddDelButtonWrapper>
              </InputLayerHeader>

              <InputWrapper>
                <SubInputTitle>제목</SubInputTitle>
                <TitleInput
                  type="text"
                  className="form-control"
                  value={commentArr[curFocus].title}
                  onChange={(e) => {
                    const curCommentArr = clone(commentArr);
                    curCommentArr[curFocus!].title = e.currentTarget.value;
                    setCommentArr(curCommentArr);
                  }}
                ></TitleInput>
              </InputWrapper>
              <InputWrapper>
                <SubInputTitle>내용</SubInputTitle>
                <TitleInput
                  type="text"
                  className="form-control"
                  value={commentArr[curFocus!].comment}
                  onChange={(e) => {
                    const curCommentArr = clone(commentArr);
                    curCommentArr[curFocus!].comment = e.currentTarget.value;
                    setCommentArr(curCommentArr);
                  }}
                ></TitleInput>
              </InputWrapper>
            </RightColumnLayer>
          ) : (
            <RightColumnLayer></RightColumnLayer>
          )
        }
      />
    </ContentWrapper>
  );
}

interface WrapperProps {
  state: boolean;
}

const ContentWrapper = styled.div`
  min-width: 1100px;

  max-height: 700px;
  border: 1px solid #ced4da;
  border-radius: 1rem;
  background-color: white;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RightColumnLayer = styled.div`
  width: 100%;
  min-height: 100px;
  div.input_layer_header {
    display: flex;
    flex-direction: row;
  }
`;

interface CommentInputLayerProps {
  $focus: boolean;
}

const CommentInputLayer = styled.div<CommentInputLayerProps>`
  width: 500px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
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

const VacantInputLayer = styled(CommentInputLayer)`
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
  width: 110px;
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
