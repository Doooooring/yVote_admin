import { useArr } from '@/utils/hook/useArr';
import useObject from '@/utils/hook/useObject';
import { getCommentRest } from '@/utils/news';
import { getStandardDateForm } from '@/utils/tools';
import { PrimaryButton } from '@components/common/button';
import { Blank } from '@components/common/figure';
import ImageUpload from '@components/common/imageUpload';
import IsShow from '@components/common/isShow';
import TextEditor from '@components/common/textEditor';
import Select_DropDown from '@components/common/select/select_dropdown/select_dropdown';
import { KeywordTitle } from '@interface/keywords';
import {
  commentType,
  NewsState,
  NewsStateKor,
  NewsSummary,
  NewsToEdit,
  NewsToPatch,
  NewsType,
  newsTypesToKor,
  PartyVote,
  TimelineToEdit,
} from '@interface/news';
import { useCommonStore } from '@store/common';
import { useNewsStore } from '@store/news';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CommentModal from '../commenModal';
import EditNewsSummaries from '../editNewsSummaries/editNewsSummaries';
import EditSummariesToolbar from '../editSummariesToolbar';
import KeywordSelect from '../keywordSelect';
import NewsContentPreview from '../newsContentPreview';
import TimelineInput from '../timelineInput';
import { useReactQuill } from '@/utils/hook/useReactQuill';

interface EditNewsProps {
  newsOrg: NewsToEdit;
  submit: (news: NewsToPatch) => void;
}

const NewsStates = Object.values(NewsState);
const NewsTypes = Object.values(NewsType);

export default function EditNews({ newsOrg, submit }: EditNewsProps) {
  const [news, setNewsVal] = useObject<NewsToEdit>(newsOrg);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsSelectorModalUp = useCommonStore((state) => state.setIsSelectorModalUp);
  const setCommentSelected = useNewsStore((state) => state.setCommentSelected);

  const [commentSelected] = useNewsStore((state) => [state.commentSelected]);

  const {
    curFocus: summarySelected,
    setCurFocus: setSummarySelected,
    addArr: addSummary,
    deleteArr: deleteSummary,
    moveArrLeft: moveSummaryLeft,
    moveArrRight: moveSummaryRight,
  } = useArr(
    news.summaries,
    (summaries: Array<NewsSummary>) => {
      setNewsVal('summaries', summaries);
    },
    () => {
      const restType = getCommentRest(news.summaries.map((summary) => summary.commentType))[0];
      if (!restType) return null;

      return {
        commentType: restType,
        summary: '',
        newsId: news.id,
      };
    },
    news.summaries.length > 0 ? 0 : null,
  );

  // Drag-and-drop for party vote rows
  const dragIdxRef = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Helper: Parse HTML agenda input into JSON structure (browser-safe)
  function htmlAgendaToJson(html: string) {
    if (!html) return [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    type AgendaGroup = { title: string; items: string[] };
    const groups: AgendaGroup[] = [];
    let currentGroup: AgendaGroup | null = null;
    Array.from(doc.body.children).forEach((el) => {
      if (el.tagName === 'UL') {
        const title = el.querySelector('li')?.textContent?.trim() || '';
        if (currentGroup && (currentGroup as AgendaGroup).items.length) groups.push(currentGroup as AgendaGroup);
        currentGroup = { title, items: [] };
      } else if (el.tagName === 'P') {
        const item = el.textContent?.trim() || '';
        if (currentGroup && item) (currentGroup as AgendaGroup).items.push(item);
      }
    });
    if (currentGroup && (currentGroup as AgendaGroup).items.length) groups.push(currentGroup as AgendaGroup);
    return groups;
  }

  // Helper: Parse HTML speech input into JSON structure (browser-safe)
  // Helper: Parse HTML speech input into grouped JSON structure (browser-safe)
  function htmlSpeechToJson(html: string) {
    if (!html) return [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    type SpeechGroup = { title: string; items: string[] };
    const groups: SpeechGroup[] = [];
    let currentGroup: SpeechGroup | null = null;
    Array.from(doc.body.children).forEach((el) => {
      if (el.tagName === 'UL') {
        const title = el.querySelector('li')?.textContent?.trim() || '';
        if (currentGroup && (currentGroup as SpeechGroup).items.length) groups.push(currentGroup as SpeechGroup);
        currentGroup = { title, items: [] };
      } else if (el.tagName === 'P') {
        const item = el.textContent?.trim() || '';
        if (currentGroup && item) (currentGroup as SpeechGroup).items.push(item);
      }
    });
    if (currentGroup && (currentGroup as SpeechGroup).items.length) groups.push(currentGroup as SpeechGroup);
    return groups;
  }

  // Helper: Convert agendaList JSON to HTML for editor display
  function agendaJsonToHtml(json: string) {
    let groups: { title: string; items: string[] }[] = [];
    try {
      groups = JSON.parse(json);
    } catch {
      return json || '';
    }
    return groups
      .map(
        (group) =>
          `<ul><li>${group.title}</li></ul>` +
          group.items.map((item) => `<p>${item}</p>`).join('')
      )
      .join('');
  }

  // Helper: Convert speechContent JSON to HTML for editor display
  function speechJsonToHtml(json: string) {
    let groups: { title: string; items: string[] }[] = [];
    try {
      groups = JSON.parse(json);
    } catch {
      return json || '';
    }
    if (!Array.isArray(groups)) return '';
    return groups
      .map((group) => {
        const title = group && typeof group.title === 'string' ? group.title : '';
        const items = Array.isArray(group?.items) ? group.items : [];
        return `<ul><li>${title}</li></ul>` + items.map((item) => `<p>${item}</p>`).join('');
      })
      .join('');
  }

  const submitNews = useCallback(async () => {
    if (isLoading) return;
    if (!news.date) {
      const now = new Date();
      news.date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    let agendaList = news.agendaList;
    let speechContent = news.speechContent;
    // If agendaList is not valid JSON, try to parse it from HTML
    try {
      JSON.parse(agendaList ?? '');
    } catch {
      agendaList = JSON.stringify(htmlAgendaToJson(agendaList ?? ''));
    }
    // If speechContent is not valid JSON, try to parse it from HTML
    try {
      JSON.parse(speechContent ?? '');
    } catch {
      speechContent = JSON.stringify(htmlSpeechToJson(speechContent ?? ''));
    }
    // Sort summaries by fixed commentType order
    const summaryOrder: string[] = [
      commentType.와이보트,
      commentType.헌법재판소,
      commentType.청와대,
      commentType.행정부,
      commentType.국민의힘,
      commentType.더불어민주당,
      commentType.기타,
    ];
    const sortedSummaries = [...news.summaries].sort((a, b) => {
      const ai = summaryOrder.indexOf(a.commentType);
      const bi = summaryOrder.indexOf(b.commentType);
      return (ai === -1 ? summaryOrder.length : ai) - (bi === -1 ? summaryOrder.length : bi);
    });
    // Normalize &nbsp; and insert space after numbered prefixes like "25." when missing
    const trimmedBillDetail = (news.billDetail ?? '')
      .replace(/&nbsp;/g, ' ')
      .replace(/>(\d+(?:의\d+)?\.)(<)/g, '>$1 $2');
    const { comments, ...rest } = news;
    submit({
      ...rest,
      summaries: sortedSummaries,
      agendaList,
      speechContent,
      billDetail: trimmedBillDetail,
      billSummary: news.billSummary,
      proDebate: news.proDebate,
      conDebate: news.conDebate,
      billAmendment: news.billAmendment,
      billVoteResult: news.billVoteResult,
      billVoteTotal: news.billVoteTotal,
      billVoteByParty: news.billVoteByParty,
    });
    return;
  }, [news, submit]);

  return (
    <>
      <TextEditWrapper>
        <ContentEditWrapper>
          <InputWrapper className="pb-1 pt-1 mb-1">
            <InputTitle>제목{'  '}</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={news.title ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewsVal('title', e.currentTarget.value);
              }}
            ></Input>
            <div style={{ width: '150px', height: '100%', paddingLeft: '10px' }}>
              <Select_DropDown
                selected={NewsTypes.indexOf(news.newsType)}
                setSelected={(i: number) => {
                  setNewsVal('newsType', NewsTypes[i]);
                }}
                menus={NewsTypes}
                selectedToView={(newsType) => {
                  return <div>{newsTypesToKor(newsType)}</div>;
                }}
                menuToView={(newsType: NewsType, selected?: boolean) => {
                  return <>{newsTypesToKor(newsType)}</>;
                }}
              />
            </div>
          </InputWrapper>
          <InputWrapper className="pb-1 pt-1 mb-1">
            <InputTitle>부제목</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={news.subTitle ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewsVal('subTitle', e.currentTarget.value);
              }}
            ></Input>
            <InputTitle>슬러그 (Url 뒤에 붙을거임)</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={news.slug ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewsVal('slug', e.currentTarget.value);
              }}
            ></Input>
          </InputWrapper>
          <InputWrapper className="pb-1 pt-1 mb-1">
            <InputTitle>날짜</InputTitle>
            <Input
              type="date"
              min="1000-01-01"
              max="9999-12-31"
              className="form-control"
              value={news.date ? getStandardDateForm(news.date!) : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const nextValue = e.target.value;
                setNewsVal('date', nextValue);
              }}
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                if (e.currentTarget.showPicker) {
                  e.currentTarget.showPicker();
                }
              }}
            />
          </InputWrapper>
          <InputWrapper className="pb-1 pt-1 mb-1">
            <ImageUpload
              setImageUrl={(s: string | null) => {
                setNewsVal('newsImage', s);
              }}
            />
          </InputWrapper>
          <EditSummariesToolbar
            newsId={news.id}
            summaries={news.summaries}
            setSummaries={(summaries: Array<NewsSummary>) => {
              setNewsVal('summaries', summaries);
            }}
            addSummary={addSummary}
            deleteSummary={deleteSummary}
            moveSummaryLeft={moveSummaryLeft}
            moveSummaryRight={moveSummaryRight}
            summarySelected={summarySelected}
            setSummarySelected={setSummarySelected}
          />
          <Blank size={8} />
          <EditNewsSummaries
            summarySelected={summarySelected}
            summaries={news.summaries}
            setSummaries={(summaries: Array<NewsSummary>) => {
              setNewsVal('summaries', summaries);
            }}
            newsType={news.newsType}
          />
          <StateToggleWrapper>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <ToggleTitle>뉴스 상태</ToggleTitle>
              <Select_DropDown
                selected={NewsStates.indexOf(news.state)}
                setSelected={(i: number) => {
                  setNewsVal('state', NewsStates[i]);
                }}
                menus={NewsStates}
                selectedToView={(state: NewsState) => {
                  return <div>{NewsStateKor(state)}</div>;
                }}
                menuToView={(state: NewsState, selected?: boolean) => {
                  return <>{NewsStateKor(state)}</>;
                }}
              />
            </InputWrapper>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <PrimaryButton
                title={'평론 편집'}
                click={() => {
                  if (summarySelected == null) return;
                  setCommentSelected(news.summaries[summarySelected!].commentType);
                }}
              />
            </InputWrapper>
          </StateToggleWrapper>
          <KeywordSetter>
            <PrimaryButton
              title={'키워드 선택하기'}
              click={() => {
                setIsSelectorModalUp(true);
              }}
            />
            <KeywordWrapper>
              {news.keywords.map((keyword, idx) => {
                return <KeywordLi key={idx}>{keyword.keyword}</KeywordLi>;
              })}
            </KeywordWrapper>
          </KeywordSetter>
        </ContentEditWrapper>
        {news.newsType === NewsType.cabinet ? (
          <CabinetExtraWrapper>
            <CabinetExtraBox>
              <CabinetExtraTitle>안건 목록</CabinetExtraTitle>
              <CabinetTextEditor
                value={agendaJsonToHtml(news.agendaList ?? '')}
                onChange={(value) => {
                  // Parse HTML to JSON structure for agendaList
                  const agendaJson = htmlAgendaToJson(value);
                  setNewsVal('agendaList', JSON.stringify(agendaJson));
                }}
              />
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>주요 발언 내용</CabinetExtraTitle>
              <CabinetTextEditor
                value={speechJsonToHtml(news.speechContent ?? '')}
                onChange={(value) => {
                  // Parse HTML to JSON array for speechContent
                  const speechJson = htmlSpeechToJson(value);
                  setNewsVal('speechContent', JSON.stringify(speechJson));
                }}
              />
            </CabinetExtraBox>
          </CabinetExtraWrapper>
        ) : news.newsType === NewsType.bill ? (
          <CabinetExtraWrapper>
            <CabinetExtraBox>
              <CabinetExtraTitle>법안 요약</CabinetExtraTitle>
              <CabinetTextEditor
                value={news.billSummary ?? ''}
                onChange={(value) => {
                  setNewsVal('billSummary', value);
                }}
              />
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>법안 상세보기</CabinetExtraTitle>
              <CabinetTextEditor
                value={news.billDetail ?? ''}
                onChange={(value) => {
                  setNewsVal('billDetail', value);
                }}
              />
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>표결 정보</CabinetExtraTitle>
              <VoteInputRow>
                <VoteInputGroup>
                  <VoteInputLabel>의결결과</VoteInputLabel>
                  <VoteInput
                    type="text"
                    value={news.billVoteResult ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsVal('billVoteResult', e.target.value)}
                    placeholder="원안가결, 수정가결, 부결 등"
                  />
                </VoteInputGroup>
                <VoteInputGroup>
                  <VoteInputLabel>총투표</VoteInputLabel>
                  <VoteInput
                    type="number"
                    value={news.billVoteTotal ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsVal('billVoteTotal', Number(e.target.value))}
                  />
                </VoteInputGroup>
              </VoteInputRow>
              <VotePartyTable>
                <thead>
                  <tr>
                    <th style={{ width: '28px' }}></th>
                    <th>정당</th>
                    <th>찬성</th>
                    <th>반대</th>
                    <th>기권</th>
                    <th>불참</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(news.billVoteByParty ?? []).map((pv, idx) => (
                    <VotePartyRow
                      key={idx}
                      draggable
                      $isDragOver={dragOverIdx === idx}
                      onDragStart={() => {
                        dragIdxRef.current = idx;
                      }}
                      onDragOver={(e: React.DragEvent<HTMLTableRowElement>) => {
                        e.preventDefault();
                        setDragOverIdx(idx);
                      }}
                      onDragLeave={() => {
                        if (dragOverIdx === idx) setDragOverIdx(null);
                      }}
                      onDrop={() => {
                        const from = dragIdxRef.current;
                        if (from !== null && from !== idx) {
                          const updated = [...(news.billVoteByParty ?? [])];
                          const [item] = updated.splice(from, 1);
                          updated.splice(idx, 0, item);
                          setNewsVal('billVoteByParty', updated);
                        }
                        dragIdxRef.current = null;
                        setDragOverIdx(null);
                      }}
                      onDragEnd={() => {
                        dragIdxRef.current = null;
                        setDragOverIdx(null);
                      }}
                    >
                      <td>
                        <DragHandle>⠿</DragHandle>
                      </td>
                      <td>
                        <VoteInput
                          type="text"
                          value={pv.party}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...(news.billVoteByParty ?? [])];
                            updated[idx] = { ...updated[idx], party: e.target.value };
                            setNewsVal('billVoteByParty', updated);
                          }}
                          placeholder="정당명"
                        />
                      </td>
                      {(['for', 'against', 'abstain', 'absent'] as const).map((field) => (
                        <td key={field}>
                          <VoteInput
                            type="number"
                            value={pv[field]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const updated = [...(news.billVoteByParty ?? [])];
                              updated[idx] = { ...updated[idx], [field]: Number(e.target.value) };
                              setNewsVal('billVoteByParty', updated);
                            }}
                            style={{ width: '70px' }}
                          />
                        </td>
                      ))}
                      <td>
                        <VoteDeleteBtn
                          onClick={() => {
                            const updated = (news.billVoteByParty ?? []).filter((_, i) => i !== idx);
                            setNewsVal('billVoteByParty', updated);
                          }}
                        >
                          ✕
                        </VoteDeleteBtn>
                      </td>
                    </VotePartyRow>
                  ))}
                </tbody>
              </VotePartyTable>
              <VoteAddBtn
                onClick={() => {
                  setNewsVal('billVoteByParty', [
                    ...(news.billVoteByParty ?? []),
                    { party: '', for: 0, against: 0, abstain: 0, absent: 0 },
                  ]);
                }}
              >
                + 정당 추가
              </VoteAddBtn>
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>수정안 내용</CabinetExtraTitle>
              <CabinetTextEditor
                value={news.billAmendment ?? ''}
                onChange={(value) => {
                  setNewsVal('billAmendment', value);
                }}
              />
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>찬성 토론</CabinetExtraTitle>
              <CabinetTextEditor
                value={news.proDebate ?? ''}
                onChange={(value) => {
                  setNewsVal('proDebate', value);
                }}
              />
            </CabinetExtraBox>
            <CabinetExtraBox>
              <CabinetExtraTitle>반대 토론</CabinetExtraTitle>
              <CabinetTextEditor
                value={news.conDebate ?? ''}
                onChange={(value) => {
                  setNewsVal('conDebate', value);
                }}
              />
            </CabinetExtraBox>
          </CabinetExtraWrapper>
        ) : (
          <NewsPreviewWrapper>
            {summarySelected != null ? (
              <IsShow state={summarySelected !== null}>
                <NewsContentPreview
                  title={news.title}
                  content={news.summaries[summarySelected!].summary}
                  state={news.state}
                  keywords={(news.keywords ?? []).map((k) => k.keyword)}
                />
              </IsShow>
            ) : (
              <></>
            )}
          </NewsPreviewWrapper>
        )}
      </TextEditWrapper>
      <ContentWrapper className="mb-5" state={news.id !== null}>
        <TimelineInput
          timeline={news.timeline}
          handleTimeline={(timeline: TimelineToEdit[]) => {
            setNewsVal('timeline', timeline);
          }}
        />
        <OpinionWrapper className="d-flex flex-row  align-items-center mb-3 mt-3">
          <InputTitle>의견</InputTitle>
          <InputBody className="d-flex flex-row align-items-center w-100">
            <OpinionLeft>왼쪽</OpinionLeft>
            <Input
              type="text"
              className="form-control"
              value={news.opinionLeft}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.currentTarget.value;
                setNewsVal('opinionLeft', v);
              }}
            ></Input>
            <OpinionRight>오른쪽</OpinionRight>
            <Input
              type="text"
              className="form-control"
              value={news.opinionRight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.currentTarget.value;
                setNewsVal('opinionRight', v);
              }}
            ></Input>
          </InputBody>
        </OpinionWrapper>
        <SubmitWrapper>
          <PrimaryButton
            title="SUBMIT"
            click={() => {
              submitNews();
            }}
          />
        </SubmitWrapper>
        <KeywordSelect
          curKeywordList={news.keywords}
          setCurKeywordList={(keywordList: KeywordTitle[]) => {
            setNewsVal('keywords', keywordList);
          }}
        />
        {commentSelected ? <CommentModal newsId={news.id} /> : <></>}
      </ContentWrapper>
    </>
  );
}

function CabinetTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const isMount = useRef(false);
  const { ref, handleContents, initializeQuillContents } = useReactQuill();

  const updateValue = useCallback(
    (text: string) => {
      handleContents(text);
      onChange(text);
    },
    [handleContents, onChange],
  );

  useEffect(() => {
    if (ref.current && !isMount.current) {
      initializeQuillContents(value ?? '');
      isMount.current = true;
    }
  }, [value, initializeQuillContents, ref]);

  return (
    <CabinetEditorWrapper>
      <TextEditor
        ref={ref}
        style={{ height: '240px' }}
        onChange={updateValue}
        onMount={() => {
          initializeQuillContents(value ?? '');
        }}
      />
    </CabinetEditorWrapper>
  );
}


const TextEditWrapper = styled.div`
  width: 100%;
  display: flex;

  flex-direction: row;
`;

const ContentEditWrapper = styled.div`
  width: 1300px;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

const StateToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 0.5rem 0;
`;

interface ContentWrapperProps {
  state: boolean;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
  width: 100%;
`;

const NewsPreviewWrapper = styled.div`
  width: 100%;

  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;

  background-color: #f1f2f3;
`;

const CabinetExtraWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
`;

const CabinetExtraBox = styled.div`
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: #ffffff;
  padding: 12px;
`;

const CabinetExtraTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const CabinetEditorWrapper = styled.div`
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  overflow: hidden;
  min-height: 240px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`;
const InputTitle = styled.div`
  flex: 1 0 auto;
  font-size: 16px;
  font-weight: bold;
  padding: 0 1rem;
  min-width: 80px;
`;

const ToggleTitle = styled.div`
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: bold;
  padding: 0 0.5rem;
`;

const OpinionTitle = styled.div`
  flex: 1 0 auto;
  width: 120px;
  font-size: 18px;
`;

const OpinionLeft = styled(OpinionTitle)`
  color: blue;
`;
const OpinionRight = styled(OpinionTitle)`
  color: red;
`;

const Input = styled.input``;

const OpinionWrapper = styled.div``;

const InputBody = styled.div`
  gap: 20px;
`;

const KeywordSetter = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
`;


const KeywordWrapper = styled.ul`
  padding: 0.375rem 0.75rem;
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-top: 10px;
`;
const KeywordLi = styled.li`
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  margin-bottom: 5px;
`;

const VoteInputRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const VoteInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VoteInputLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

const VoteInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  &[type='number'] {
    width: 80px;
  }
`;

const VotePartyTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
  font-size: 13px;

  th {
    text-align: left;
    padding: 4px 6px;
    border-bottom: 1px solid #dee2e6;
    font-weight: 600;
  }

  td {
    padding: 4px 6px;
    border-bottom: 1px solid #f1f3f5;
  }
`;

const VotePartyRow = styled.tr<{ $isDragOver: boolean }>`
  background: ${({ $isDragOver }) => ($isDragOver ? '#e9ecef' : 'transparent')};
  transition: background 0.15s;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled.span`
  cursor: grab;
  color: #adb5bd;
  font-size: 16px;
  user-select: none;
  display: inline-block;
  width: 20px;
  text-align: center;

  &:hover {
    color: #495057;
  }
`;

const VoteDeleteBtn = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
`;

const VoteAddBtn = styled.button`
  background: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  color: #495057;

  &:hover {
    background: #e9ecef;
  }
`;

const SubmitWrapper = styled.div`
  padding: 0.5rem;
`;
