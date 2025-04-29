import { TextButton } from '@components/common/button';
import { Row } from '@components/common/figure';
import IsShow from '@components/common/isShow';
import { commentType, NewsSummary } from '@interface/news';
import { useArr } from '@utils/hook/useArr';
import { commentTypeColor, getCommentRest } from '@utils/news';
import { useCallback } from 'react';
import styled from 'styled-components';
import EditNewsSummary from './editNewsSummary';

interface EditNewsSummariesProps {
  newsId: number;
  summaries: Array<NewsSummary>;
  setSummaries: (summaries: Array<NewsSummary>) => void;
}

export default function EditNewsSummaries({
  newsId,
  summaries,
  setSummaries,
}: EditNewsSummariesProps) {
  const {
    curFocus: summarySelected,
    setCurFocus: setSummarySelected,
    addArr: addSummary,
    deleteArr: deleteSummary,
    moveArrLeft: moveSummaryLeft,
    moveArrRight: moveSummaryRight,
  } = useArr(summaries, setSummaries, () => {
    const restType = getCommentRest(summaries.map((summary) => summary.commentType))[0];
    return {
      id: null,
      commentType: restType,
      summary: '',
      newsId,
    };
  });

  const saveSummary = useCallback(
    (summary: NewsSummary) => {
      const ne = summaries.map((sm) => {
        if (sm.commentType === summary.commentType) {
          sm = summary;
        }
        return sm;
      });
      setSummaries(ne);
    },
    [summaries, setSummaries],
  );

  return (
    <Wrapper>
      <ButtonWrapper>
        <SlideWrapper>
          {summaries.map((summary, idx) => {
            return (
              <CommentButton
                $state={summarySelected !== null && summarySelected === idx}
                commentType={summary.commentType}
                onClick={() => {
                  setSummarySelected(idx);
                }}
              >
                {summary.commentType}
              </CommentButton>
            );
          })}
        </SlideWrapper>
        <OptionWrapper></OptionWrapper>
      </ButtonWrapper>
      <SummaryEditorWrapper>
        <IsShow state={summarySelected !== null}>
          <EditNewsSummary summary={summaries[summarySelected!]} saveSummary={saveSummary} />
        </IsShow>
      </SummaryEditorWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const ButtonWrapper = styled(Row)``;

const SlideWrapper = styled(Row)``;

const OptionWrapper = styled(Row)``;

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

const SummaryEditorWrapper = styled.div``;
