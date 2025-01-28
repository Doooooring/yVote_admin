import { PrimaryButton } from '@components/common/button';
import ImageUpload from '@components/common/imageUpload';
import TextEditor from '@components/common/textEditor';
import ToggleButton from '@components/common/toggleButton';
import { KeywordTitle } from '@interface/keywords';
import { commentType, NewsToEdit, NewsToPatch, TimelineToEdit } from '@interface/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';
import useObject from '@utils/hook/useObject';
import { useReactQuill } from '@utils/hook/useReactQuill';
import { getStandardDateForm } from '@utils/tools';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import CommentModal from '../commenModal';
import CommentInput from '../commentInput';
import KeywordSelect from '../keywordSelect';
import NewsContentPreview from '../newsContentPreview';
import TimelineInput from '../timelineInput';

interface EditNewsProps {
  newsOrg: NewsToEdit;
  submit: (news: NewsToPatch) => void;
}

export default function EditNews({ newsOrg, submit }: EditNewsProps) {
  const { ref, content, handleContents, initializeQuillContents, resetContents } = useReactQuill();
  const [news, setNewsVal] = useObject<NewsToEdit>(newsOrg);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsSelectorModalUp = useCommonStore((state) => state.setIsSelectorModalUp);

  const [commentSelected] = useNewsStore((state) => [state.commentSelected]);
  const keywordTitleList = useKeywordStore((state) => state.keywordTitleList);

  useEffect(() => {
    if (ref.current) {
      initializeQuillContents(newsOrg.summary);
    }
  }, [window, newsOrg]);

  const submitNews = useCallback(async () => {
    if (isLoading) return;
    news.summary = content;
    if (!news.date) news.date = new Date();

    const { comments, ...rest } = news;
    submit(rest);
  }, [news, content, submit]);

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
          <TextEditor
            ref={ref}
            style={{ height: '600px' }}
            onChange={handleContents}
            onMount={() => {
              initializeQuillContents(news.summary ?? '');
            }}
          />
          <StateToggleWrapper>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <ToggleTitle>최신 아티클</ToggleTitle>
              <ToggleButton
                state={news.state ?? false}
                setState={(state: boolean) => {
                  setNewsVal('state', state);
                }}
                style={{
                  width: '50px',
                  height: '25px',
                  backgroundColor: '#77C998',
                  padding: '0.3rem',
                }}
                circleStyle={{ width: '13px', height: '13px', backgroundColor: '#EDF0F1' }}
                activeColor="#4F69E7"
                unactiveColor="#A8A8A8"
                activeCircleColor="#EDF0F1"
                unactiveCircleColor="#EDF0F1"
              />
            </InputWrapper>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <ToggleTitle>퍼블리시 상태</ToggleTitle>
              <ToggleButton
                state={news.isPublished ?? false}
                setState={(state: boolean) => {
                  setNewsVal('isPublished', state);
                }}
                style={{
                  width: '50px',
                  height: '25px',
                  backgroundColor: '#77C998',
                  padding: '0.3rem',
                }}
                circleStyle={{ width: '13px', height: '13px', backgroundColor: '#EDF0F1' }}
                activeColor="#4F69E7"
                unactiveColor="#A8A8A8"
                activeCircleColor="#EDF0F1"
                unactiveCircleColor="#EDF0F1"
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
        <NewsPreviewWrapper>
          <NewsContentPreview
            title={news.title}
            content={content}
            state={news.state}
            keywords={(news.keywords ?? []).map((k) => k.keyword)}
          />
        </NewsPreviewWrapper>
      </TextEditWrapper>
      <ContentWrapper className="mb-5" state={news.id !== null}>
        <TimelineInput
          timeline={news.timeline}
          handleTimeline={(timeline: TimelineToEdit[]) => {
            setNewsVal('timeline', timeline);
          }}
        />
        <CommentInput
          comments={news.comments}
          setComments={(comments: commentType[]) => {
            setNewsVal('comments', comments);
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

const NewsPreviewWrapper = styled.div`
  width: 100%;

  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;

  background-color: #f1f2f3;
`;

const StateToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0;
`;

interface ContentWrapperProps {
  state: boolean;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
  width: 100%;
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
  flex: 0 1 1;
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
