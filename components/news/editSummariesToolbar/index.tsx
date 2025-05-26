import { CommonIconButton, TextButton } from '@components/common/button';
import CommonModal from '@components/common/comonModal';
import { Center, CommonLayoutBox, Row } from '@components/common/figure';
import EditIcon from '@components/common/icon/edit';
import IsShow from '@components/common/isShow';
import Select_Slide from '@components/common/select/select_slide/select_slide';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { commentType, NewsSummary } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { commentTypeColor, getCommentRest } from '@utils/news';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface EditSummariesToolbarProps {
  newsId: number;
  summaries: Array<NewsSummary>;
  setSummaries: (summaries: Array<NewsSummary>) => void;
  summarySelected: number | null;
  setSummarySelected: (selected: number | null) => void;
  addSummary: (idx: number) => void;
  deleteSummary: (idx: number) => void;
  moveSummaryLeft: (idx: number) => void;
  moveSummaryRight: (idx: number) => void;
}

export default function EditSummariesToolbar({
  newsId,
  summaries,
  setSummaries,
  summarySelected,
  setSummarySelected,
  addSummary,
  deleteSummary,
  moveSummaryLeft,
  moveSummaryRight,
}: EditSummariesToolbarProps) {
  const [isOpenAddComment, setIsOpenAddComment] = useState<boolean>(false);
  const [isOpenChangeComment, setIsOpenChangeComment] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const onClickAddButton = useCallback(() => {
    let next = summarySelected ?? 0;
    addSummary(next);
  }, [summarySelected, addSummary]);

  const onClickDeleteButton = useCallback(() => {
    const is = window.confirm('삭제 하시겠습니까?');
    if (is) {
      deleteSummary(summarySelected!);
    }
  }, [summarySelected, deleteSummary]);

  const onChangeCommentType = useCallback(
    async (commentType: commentType) => {
      if (!summarySelected) return;
      const response = await newsRepositories.saveNewComment(newsId, commentType);
      if (!response) {
        throw new Error('결과가 이상하네??');
      }

      const ne = [...summaries];
      const summary = summaries[summarySelected];
      summary.commentType = commentType;
      setSummaries(ne);
    },
    [newsId, summaries, summarySelected, setSummaries],
  );

  const commentRest = useCallback(() => {
    return getCommentRest(summaries.map((summary) => summary.commentType));
  }, [summaries]);

  return (
    <ButtonWrapper>
      <SlideWrapper>
        <PopUpButtonLayout>
          <PopUpButton
            onClick={(e) => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <EditIcon width={24} height={24} />
          </PopUpButton>
          <IsShow state={isMenuOpen && (summaries.length === 0 || summarySelected !== null)}>
            {isOpenAddComment ? (
              <SaveComment
                commentTypes={commentRest()}
                save={onChangeCommentType}
                close={() => setIsOpenAddComment(false)}
              />
            ) : (
              <OptionWrapper>
                <>
                  <PopButtonWrapper>
                    <Button className="btn btn-primary" onClick={onClickAddButton}>
                      추가
                    </Button>
                    <Button className="btn btn-secondary" onClick={onClickDeleteButton}>
                      삭제
                    </Button>
                  </PopButtonWrapper>
                  <UpdowButtonWrapper>
                    <OrderButton onClick={() => moveSummaryLeft(summarySelected!)}>
                      <FontAwesomeIcon icon={faChevronLeft} width="12px" />
                    </OrderButton>
                    <Text>이동</Text>

                    <OrderButton onClick={() => moveSummaryRight(summarySelected!)}>
                      <FontAwesomeIcon icon={faChevronRight} width="12px" />
                    </OrderButton>
                  </UpdowButtonWrapper>

                  {summarySelected !== null ? (
                    <SelectWrapper>
                      <CommentSelect
                        className="form-select"
                        value={summaries[summarySelected].commentType}
                      >
                        {[summaries[summarySelected!].commentType, ...commentRest()].map(
                          (comment, idx) => {
                            return (
                              <option key={comment + JSON.stringify(idx)} value={comment}>
                                {comment}
                              </option>
                            );
                          },
                        )}
                      </CommentSelect>
                    </SelectWrapper>
                  ) : (
                    <></>
                  )}
                </>
              </OptionWrapper>
            )}
          </IsShow>
        </PopUpButtonLayout>
        <IsShow state={summaries.length > 0}>
          <Select_Slide
            direction="row"
            menus={summaries}
            selected={summarySelected}
            setSelected={setSummarySelected}
            menuToView={(summary, selected) => {
              return (
                <p
                  style={{
                    color: selected ? commentTypeColor(summary.commentType) : 'rgb(150, 150, 150)',
                    margin: 0,
                  }}
                >
                  {summary.commentType}
                </p>
              );
            }}
          />
        </IsShow>
        <IsShow state={isOpenChangeComment}>
          <ChangeComment
            commentTypeSelectedOrg={summaries[summarySelected!].commentType}
            commentTypes={commentRest()}
            change={onChangeCommentType}
            close={() => setIsOpenChangeComment(false)}
          />
        </IsShow>
      </SlideWrapper>
    </ButtonWrapper>
  );
}

function SaveComment({
  commentTypes,
  save,
  close,
}: {
  commentTypes: Array<commentType>;
  save: (commentType: commentType) => Promise<void>;
  close: () => void;
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [commentTypeSelected, setCommentTypeSelected] = useState<commentType>(commentTypes[0]);

  const onSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const response = await save(commentTypeSelected);

      alert('생성 되었습니다~');
      close();
    } catch (e) {
      console.log(e);

      alert('다시 시도해주시오.');
    } finally {
      setIsSaving(false);
    }
  }, [commentTypeSelected, save]);

  if (commentTypes.length === 0) {
    return <>더 추가할 게 없군요~</>;
  }
  return (
    <OptionWrapper>
      {isSaving ? (
        <>기다려보셈</>
      ) : (
        <>
          <SelectWrapper>
            <CommentSelect className="form-select" value={commentTypeSelected}>
              {commentTypes.map((comment, idx) => {
                return (
                  <option key={comment + JSON.stringify(idx)} value={comment}>
                    {comment}
                  </option>
                );
              })}
            </CommentSelect>
          </SelectWrapper>
          <PopButtonWrapper>
            <Button className="btn btn-primary" onClick={onSave}>
              저장
            </Button>
            <Button className="btn btn-secondary" onClick={close}>
              취소
            </Button>
          </PopButtonWrapper>
        </>
      )}
    </OptionWrapper>
  );
}

function ChangeComment({
  commentTypeSelectedOrg,
  commentTypes,
  change,
  close,
}: {
  commentTypeSelectedOrg: commentType;
  commentTypes: Array<commentType>;
  change: (commentType: commentType) => Promise<void>;
  close: () => void;
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [commentTypeSelected, setCommentTypeSelected] =
    useState<commentType>(commentTypeSelectedOrg);

  const mergedCommentTypes = useMemo(() => {
    if (commentTypes.includes(commentTypeSelected)) {
      return commentTypes;
    }
    return [commentTypeSelected, ...commentTypes];
  }, [commentTypeSelected, commentTypes]);

  const onSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const response = await change(commentTypeSelected);

      alert('생성 되었습니다~');
      close();
    } catch (e) {
      console.log(e);

      alert('다시 시도해주시오.');
    } finally {
      setIsSaving(false);
    }
  }, [commentTypeSelected, change]);

  return (
    <CommonModal state={true} outClickAction={close}>
      <SelectWrapper>
        <CommentSelect
          className="form-select"
          value={commentTypeSelected}
          onChange={(e) => setCommentTypeSelected(e.currentTarget.value as commentType)}
        >
          {mergedCommentTypes.map((comment, idx) => {
            return (
              <option key={comment + JSON.stringify(idx)} value={comment}>
                {comment}
              </option>
            );
          })}
        </CommentSelect>
      </SelectWrapper>
      <PopButtonWrapper>
        <Button className="btn btn-primary" onClick={onSave}>
          저장
        </Button>
        <Button className="btn btn-secondary" onClick={close}>
          닫기
        </Button>
      </PopButtonWrapper>
    </CommonModal>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
`;

const PopUpButtonLayout = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 9999;
`;

const PopUpButton = styled(CommonIconButton)`
  border-color: rgb(150, 150, 150);
  width: 20px;
  height: 20px;

  cursor: pointer;
`;

const SlideWrapper = styled.div`
  width: 100%;
  height: 45px;
  position: relative;
`;

const OptionWrapper = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  right: -10px;
  transform: translateX(100%);
`;

const PopButtonWrapper = styled(Row)`
  gap: 8px;
`;

const ModalBody = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: column;
`;

interface CommentButtonProps {
  $state: boolean;
  commentType: commentType;
}

const CommentButton = styled(TextButton)<CommentButtonProps>`
  ${({ $state, commentType }) => {
    return $state
      ? `
      border-color: rgb(11, 104, 179);
      color : ${commentTypeColor(commentType)};
    `
      : `
      border-color: rgb(100, 100, 100);
      color : rgb(100, 100, 100);
    `;
  }}
`;

const UpdowButtonWrapper = styled(Row)`
  width: 100%;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const Text = styled(CommonLayoutBox)`
  padding: 0 0.1rem;
`;

const OrderButton = styled(Center)`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border: 2px solid rgb(150, 150, 150);
  cursor: pointer;
`;

const Button = styled.button`
  width: 55px;
  height: 35px;
  font-size: 12px;
`;

const SelectWrapper = styled.div``;

const CommentSelect = styled.select`
  width: 200px;
`;
