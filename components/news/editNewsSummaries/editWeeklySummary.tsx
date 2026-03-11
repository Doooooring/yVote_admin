import React, { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '@/utils/tools';
import { NewsSummary } from '@interface/news';
import styled from 'styled-components';

interface DateEntry {
  date: string;
  summary: string;
}

interface EditWeeklySummaryProps {
  summary: NewsSummary;
  saveSummary: (summary: NewsSummary) => void;
}

function parseEntries(raw: string): DateEntry[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((e: any) => e && typeof e === 'object')
        .map((e: any) => ({
          date: String(e.date ?? ''),
          summary: stripHtml(String(e.summary ?? '')),
        }));
    }
  } catch {}
  return [];
}

function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? '';
  }
  return html.replace(/<[^>]+>/g, '');
}

function serializeEntries(entries: DateEntry[]): string {
  const out = entries
    .filter((e) => e.date.trim() || e.summary.trim())
    .map((e) => ({ date: e.date.trim(), summary: e.summary.trim() }));
  return JSON.stringify(out, null, 0);
}

export default function EditWeeklySummary({
  summary,
  saveSummary: _saveSummary,
}: EditWeeklySummaryProps) {
  const [entries, setEntries] = useState<DateEntry[]>(() => parseEntries(summary.summary));
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((newSummary: NewsSummary) => _saveSummary(newSummary), 500),
    [_saveSummary],
  );

  const save = useCallback(
    (updated: DateEntry[]) => {
      setEntries(updated);
      debouncedSave({ ...summary, summary: serializeEntries(updated) });
    },
    [summary, debouncedSave],
  );

  const addEntry = () => {
    save([...entries, { date: '', summary: '' }]);
  };

  const removeEntry = (idx: number) => {
    save(entries.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx: number, field: 'date' | 'summary', value: string) => {
    const updated = entries.map((e, i) => (i === idx ? { ...e, [field]: value } : e));
    save(updated);
  };

  return (
    <Wrapper>
      <AddButton type="button" onClick={addEntry}>
        + 날짜 추가
      </AddButton>
      {entries.length === 0 && <Empty>날짜/요약 항목이 없습니다. 위 버튼으로 추가하세요.</Empty>}
      {entries.map((entry, idx) => (
        <EntryCard key={idx}>
          <EntryHeader>
            <DateLabel>날짜</DateLabel>
            <DateInput
              type="text"
              placeholder="2026.01.19"
              value={entry.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEntry(idx, 'date', e.target.value)}
            />
            <RemoveButton type="button" onClick={() => removeEntry(idx)}>
              ✕
            </RemoveButton>
          </EntryHeader>
          <SummaryTextarea
            placeholder="요약 내용 (줄바꿈으로 문단 구분)"
            value={entry.summary}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateEntry(idx, 'summary', e.target.value)}
          />
        </EntryCard>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
`;

const AddButton = styled.button`
  align-self: flex-start;
  padding: 6px 16px;
  font-size: 14px;
  border: 1px dashed #94a3b8;
  border-radius: 6px;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
  }
`;

const Empty = styled.div`
  color: #94a3b8;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
`;

const EntryCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
`;

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DateLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
`;

const DateInput = styled.input`
  flex: 1;
  max-width: 160px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const RemoveButton = styled.button`
  margin-left: auto;
  padding: 2px 8px;
  font-size: 14px;
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  &:hover {
    color: #ef4444;
  }
`;

const SummaryTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 8px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;
