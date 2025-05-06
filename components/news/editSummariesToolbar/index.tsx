import { CommonIconButton, TextButton } from '@components/common/button';
import { Center, CommonLayoutBox, Row } from '@components/common/figure';
import EditIcon from '@components/common/icon/edit';
import IsShow from '@components/common/isShow';
import Select_Slide from '@components/common/select/select_slide/select_slide';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { commentType, NewsSummary } from '@interface/news';
import { commentTypeColor } from '@utils/news';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

interface EditSummariesToolbarProps {
  summaries: Array<NewsSummary>;
  summarySelected: number | null;
  setSummarySelected: (selected: number | null) => void;
  addSummary: (idx: number) => void;
  deleteSummary: (idx: number) => void;
  moveSummaryLeft: (idx: number) => void;
  moveSummaryRight: (idx: number) => void;
}

export default function EditSummariesToolbar({
  summaries,
  summarySelected,
  setSummarySelected,
  addSummary,
  deleteSummary,
  moveSummaryLeft,
  moveSummaryRight,
}: EditSummariesToolbarProps) {
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

  return (
    <ButtonWrapper>
      <SlideWrapper>
        <PopUpButtonLayout>
          <PopUpButton
            onClick={(e) => {
              console.log('is here');
              console.log(e.currentTarget);
              console.log(e.target);

              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <EditIcon width={24} height={24} />
          </PopUpButton>
          <IsShow state={isMenuOpen && (summaries.length === 0 || summarySelected !== null)}>
            <OptionWrapper>
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
            </OptionWrapper>
          </IsShow>
        </PopUpButtonLayout>
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
      </SlideWrapper>
    </ButtonWrapper>
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
