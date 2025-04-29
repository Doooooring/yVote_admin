import TextEditor from '@components/common/textEditor';
import { NewsSummary } from '@interface/news';
import { useCallback, useEffect, useRef } from '@node_modules/@types/react';
import { useReactQuill } from '@utils/hook/useReactQuill';
import { throttle } from '@utils/tools';
import styled from 'styled-components';

interface EditNewsSummaryProps {
  summary: NewsSummary;
  saveSummary: (summary: NewsSummary) => void;
}

export default function EditNewsSummary({
  summary,
  saveSummary: _saveSummary,
}: EditNewsSummaryProps) {
  const isMount = useRef<boolean>(false);
  const { ref, content, handleContents, initializeQuillContents, resetContents } = useReactQuill();

  const throttleSave = useCallback(throttle(_saveSummary, 1000), [_saveSummary]);

  const updateSummary = useCallback(
    (text: string) => {
      const ne = { ...summary, summary: text };
      handleContents(text);
      throttleSave(ne);
    },
    [summary, throttleSave],
  );

  useEffect(() => {
    if (ref.current && !isMount.current) {
      initializeQuillContents(summary.summary);
      isMount.current = true;
    }
  }, [summary, initializeQuillContents]);

  return (
    <Wrapper>
      <TextEditor
        ref={ref}
        style={{ height: '600px' }}
        onChange={updateSummary}
        onMount={() => {
          initializeQuillContents(summary.summary ?? '');
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
