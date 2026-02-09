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
  TimelineToEdit,
} from '@interface/news';
import { useCommonStore } from '@store/common';
import { useNewsStore } from '@store/news';
import { useCallback, useEffect, useRef } from 'react';
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
      let restType = getCommentRest(news.summaries.map((summary) => summary.commentType))[0];
      if (!restType) return null;

      if (
        news.summaries.filter((summary) => {
          return summary.commentType == commentType.와이보트;
        }).length == 0
      )
        restType = commentType.와이보트;

      return {
        commentType: restType,
        summary: '',
        newsId: news.id,
      };
    },
    news.summaries.length > 0 ? 0 : null,
  );

  useEffect(() => {
    if (news.summaries.length == 0) {
      addSummary(0);
      setSummarySelected(0);
    }
  }, [news.summaries, addSummary, setSummarySelected]);

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
        if (currentGroup && currentGroup.items.length) groups.push(currentGroup);
        currentGroup = { title, items: [] };
      } else if (el.tagName === 'P') {
        const item = el.textContent?.trim() || '';
        if (currentGroup && item) currentGroup.items.push(item);
      }
    });
    if (currentGroup && currentGroup.items.length) groups.push(currentGroup);
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
    if (!news.date) news.date = new Date();
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
    const { comments, ...rest } = news;
    submit({ ...rest, agendaList, speechContent });
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
              onChange={(e) => {
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
              onChange={(e) => {
                setNewsVal('subTitle', e.currentTarget.value);
              }}
            ></Input>
            <InputTitle>슬러그 (Url 뒤에 붙을거임)</InputTitle>
            <Input
              type="text"
              className="form-control"
              value={news.slug ?? ''}
              onChange={(e) => {
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
              onChange={(e) => {
                const nextValue = e.target.value;
                const dateObj = new Date(nextValue);
                const isValid = !isNaN(dateObj.valueOf());
                if (!isValid) return;
                setNewsVal('date', dateObj);
              }}
              onClick={(e) => {
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
              onChange={(e) => {
                const v = e.currentTarget.value;
                setNewsVal('opinionLeft', v);
              }}
            ></Input>
            <OpinionRight>오른쪽</OpinionRight>
            <Input
              type="text"
              className="form-control"
              value={news.opinionRight}
              onChange={(e) => {
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

const SubmitWrapper = styled.div`
  padding: 0.5rem;
`;
