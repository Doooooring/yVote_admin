import IsShow from '@components/common/isShow';

import { NewsSummary } from '@interface/news';
import { useCallback } from 'react';
import styled from 'styled-components';
import EditNewsSummary from './editNewsSummary';

interface EditNewsSummariesProps {
  summarySelected: number | null;
  summaries: Array<NewsSummary>;
  setSummaries: (summaries: Array<NewsSummary>) => void;
}

export default function EditNewsSummaries({
  summarySelected,
  summaries,
  setSummaries,
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
            return (
              <IsShow key={summary.commentType} state={summarySelected === idx}>
                <EditNewsSummary summary={summary} saveSummary={saveSummary} />
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
