import IsShow from '@components/common/isShow';

import { NewsSummary, NewsType } from '@interface/news';
import { useCallback } from 'react';
import styled from 'styled-components';
import EditNewsSummary from './editNewsSummary';
import EditWeeklySummary from './editWeeklySummary';

interface EditNewsSummariesProps {
  summarySelected: number | null;
  summaries: Array<NewsSummary>;
  setSummaries: (summaries: Array<NewsSummary>) => void;
  newsType?: NewsType;
}

export default function EditNewsSummaries({
  summarySelected,
  summaries,
  setSummaries,
  newsType,
}: EditNewsSummariesProps) {
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
      <div>
        <SummaryEditorWrapper>
          {summaries.map((summary, idx) => {
            const Editor = newsType === NewsType.weekly ? EditWeeklySummary : EditNewsSummary;
            return (
              <IsShow key={summary.commentType} state={summarySelected === idx}>
                <Editor summary={summary} saveSummary={saveSummary} />
              </IsShow>
            );
          })}
        </SummaryEditorWrapper>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const SummaryEditorWrapper = styled.div``;
