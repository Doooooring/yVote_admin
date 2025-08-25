import { complexClone } from '@/utils';
import { useNewsStore } from '@store/news';
import styled from 'styled-components';

import { useArr } from '@/utils/hook/useArr';
import ListEditView from '@components/common/listEditView';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INF } from '@/asset';
import { useStateDepend } from '@/utils/hook/useStateDepend';
import { useFetchNewsComment } from '@/utils/news/news.hook';
import { getStandardDateForm } from '@/utils/tools';
import { PrimaryButton } from '@components/common/button';
import CommonModal from '@components/common/comonModal';
import { Center, Column, Row } from '@components/common/figure';
import LoadingCommon from '@components/common/loadingCommon';
import { CommentToEdit, commentType } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useCallback, useEffect, useState } from 'react';
import { EditBulkComments } from './component';

interface CommentModalProps {
  newsId: number;
}

export default function CommentModal({ newsId }: CommentModalProps) {
  const [commentSelected, setCommentSelected] = useNewsStore((state) => [
    state.commentSelected,
    state.setCommentSelected,
  ]);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);

  const [isBulkCommentEdit, setIsBulkCommentEdit] = useState<boolean>(false);

  const {
    curComments,
    init: initComments,
    isRequesting,
  } = useFetchNewsComment(newsId, commentSelected, INF);
  const [commentsToEdit, setCurCommentsToEdit] = useStateDepend(curComments);

  const {
    curFocus,
    setCurFocus,
    addArr: addComments,
    deleteArr: deleteComments,
    moveArrLeft: moveCommentUp,
    moveArrRight: moveCommentDown,
  } = useArr(commentsToEdit, setCurCommentsToEdit, () => {
    return { order: -1, title: '', comment: '', commentType: commentSelected! };
  });

  const saveComments = useCallback(
    async (id: number, commentType: commentType, comments: CommentToEdit[]) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await newsRepositories.patchCommentsByNewsId(id, commentType, comments);
        alert('저장되었습니다.');
        setCommentSelected(null);
      } catch (e) {
        console.log(e);
        alert('뭔가 이상하네');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    initComments();
  }, []);

  const close = useCallback(async () => {
    const result = window.confirm('저장 후 종료하겠어요?');
    try {
      if (result) {
        await saveComments(newsId, commentSelected!, commentsToEdit);
      }
      setCommentSelected(null);
    } catch (e) {}
  }, [newsId, commentSelected, commentsToEdit, saveComments, setCommentSelected]);

  const safeClose = useCallback(async () => {
    const result = window.confirm('종료하시겠습니까?');
    try {
      if (result) {
        await close();
      }
    } catch (e) {
      console.log(e);
    }
  }, [close]);
  return (
    <CommonModal
      state={commentSelected !== null}
      outClickAction={() => {
        safeClose();
      }}
    >
      <ContentWrapper>
        {isBulkCommentEdit ? (
          <EditBulkComments
            commentType={commentSelected!}
            setComments={(comments: CommentToEdit[]) => {
              setCurCommentsToEdit((prevComments) => [...comments, ...prevComments]);
            }}
            onBack={() => {
              setIsBulkCommentEdit(false);
            }}
          />
        ) : (
          <>
            <ListEditView
              title={
                <Row
                  style={{
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {commentSelected} 평론 수정
                  <button
                    className="btn btn-primary"
                    style={{
                      fontSize: '12px',
                    }}
                    onClick={() => {
                      setIsBulkCommentEdit(true);
                    }}
                  >
                    평론 붙여넣기
                  </button>
                </Row>
              }
              isRightOpen={true}
              listView={
                <>
                  {commentsToEdit?.map((item, idx) => {
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
                          {item.title === '' ? (
                            <span className="example">예시 제목 입니다.</span>
                          ) : (
                            <></>
                          )}
                        </p>
                      </CommentInputLayer>
                    );
                  })}
                  {commentsToEdit.length == 0 ? (
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
                        <Button
                          className="btn btn-secondary"
                          onClick={() => deleteComments(curFocus!)}
                        >
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
                        value={commentsToEdit[curFocus].title}
                        onChange={(e) => {
                          const curCommentsToEdit = complexClone(commentsToEdit);
                          curCommentsToEdit[curFocus!].title = e.currentTarget.value;
                          setCurCommentsToEdit(curCommentsToEdit);
                        }}
                      ></TitleInput>
                    </InputWrapper>
                    <InputWrapper>
                      <SubInputTitle>날짜</SubInputTitle>
                      <DateInput
                        type="date"
                        min="1000-01-01"
                        max="9999-12-31"
                        className="form-control"
                        value={
                          commentsToEdit[curFocus!].date
                            ? getStandardDateForm(commentsToEdit[curFocus!].date!)
                            : ''
                        }
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          const dateObj = new Date(nextValue);
                          const isValid = !isNaN(dateObj.valueOf());
                          if (!isValid) return;
                          const curCommentsToEdit = complexClone(commentsToEdit);
                          curCommentsToEdit[curFocus!].date = new Date(e.currentTarget.value);
                          setCurCommentsToEdit(curCommentsToEdit);
                        }}
                        onClick={(e) => {
                          if (e.currentTarget.showPicker) {
                            e.currentTarget.showPicker();
                          }
                        }}
                      />
                      <span style={{ paddingLeft: '0.5rem' }}>
                        {commentsToEdit[curFocus!].date
                          ? getStandardDateForm(commentsToEdit[curFocus!].date!)
                          : ''}
                      </span>
                    </InputWrapper>
                    <InputWrapper>
                      <SubInputTitle>내용</SubInputTitle>
                      <TitleInput
                        type="text"
                        className="form-control"
                        value={commentsToEdit[curFocus!].comment}
                        onChange={(e) => {
                          const curCommentsToEdit = complexClone(commentsToEdit);
                          curCommentsToEdit[curFocus!].comment = e.currentTarget.value;
                          setCurCommentsToEdit(curCommentsToEdit);
                        }}
                      ></TitleInput>
                    </InputWrapper>
                    <InputWrapper>
                      <SubInputTitle>출처</SubInputTitle>
                      <TitleInput
                        type="text"
                        className="form-control"
                        value={commentsToEdit[curFocus!].url ?? ''}
                        onChange={(e) => {
                          const curCommentsToEdit = complexClone(commentsToEdit);
                          curCommentsToEdit[curFocus!].url = e.currentTarget.value;
                          setCurCommentsToEdit(curCommentsToEdit);
                        }}
                      ></TitleInput>
                    </InputWrapper>
                  </RightColumnLayer>
                ) : (
                  <RightColumnLayer />
                )
              }
            />
            <SubmitWrapper>
              <PrimaryButton
                title="SUBMIT"
                click={() => {
                  saveComments(newsId, commentSelected!, commentsToEdit);
                }}
              />
            </SubmitWrapper>
          </>
        )}
        <Loading $state={isRequesting}>
          <LoadingCommon comment="" fontSize="3rem" iconSize={128} />
        </Loading>
      </ContentWrapper>
    </CommonModal>
  );
}

interface WrapperProps {
  state: boolean;
}

const ContentWrapper = styled.div`
  min-width: 800px;

  border: 1px solid #ced4da;
  border-radius: 1rem;
  background-color: white;

  overflow: hidden;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RightColumnLayer = styled.div`
  width: 400px;
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
  width: 220px;
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

const SubmitWrapper = styled.div`
  padding: 0.5rem;
`;

interface LoadingProps {
  $state: boolean;
}

const Loading = styled.div<LoadingProps>`
  display: ${({ $state }) => ($state ? 'block' : 'none')};

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1100;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;
