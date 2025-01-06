import { CommentsArr, NewsTitle, TimelineToEdit, commentType } from '@interface/news';
import { useCommonStore } from '@store/common';
import { complexClone } from '@utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SubmitButton } from '@components/common/button';
import CommentModal from '@components/news/commenModal';
import KeywordSelect from '@components/news/keywordSelect';
import { keywordRepositories } from '@repositories/keyword';
import { newsRepositories } from '@repositories/news';
import { useKeywordStore } from '@store/keyword';

import ImageUpload from '@components/common/imageUpload';
import TextEditor from '@components/common/textEditor';
import ToggleButton from '@components/common/toggleButton';
import CommentInput from '@components/news/commentInput';
import NewsContentPreview from '@components/news/newsContentPreview';
import TimelineInput from '@components/news/timelineInput';
import { KeywordTitle } from '@interface/keywords';
import { useNewsStore } from '@store/news';
import { useReactQuill } from '@utils/hook/useReactQuill';
import { convertCommentArrToPatch } from '@utils/news';
import { useRouter } from 'next/router';
import Header from '@components/common/header';
import Protected from '@components/common/protected';
import ProtectedLayout from '@components/common/protectedLayout';

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
    keywordTitles: Array<KeywordTitle>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const newsTitles: Array<NewsTitle> = await newsRepositories.getNewsTitles('');
  const keywordTitles: Array<KeywordTitle> = await keywordRepositories.getKeywordTitles('');
  return {
    props: {
      data: {
        newsTitles,
        keywordTitles,
      },
    },
  };
};

export default function NewsPost({ data }: pageProps) {
  const router = useRouter();

  const { ref, content, handleContents, resetContents } = useReactQuill();

  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [timeline, setTimeline] = useState<TimelineToEdit[]>([]);
  const [state, setState] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [opinionLeft, setOpinionLeft] = useState<string>('');
  const [opinionRight, setOpinionRight] = useState<string>('');
  const [newsImg, setNewsImg] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<CommentsArr>>([]);
  const [keywordList, setKeywordList] = useState<Array<KeywordTitle>>([]);

  const isLoading = useCommonStore((state) => state.isLoading);
  const setIsLoading = useCommonStore((state) => state.setIsLoading);
  const setIsSelectorModalUp = useCommonStore((state) => state.setIsSelectorModalUp);
  const setCommentSelected = useNewsStore((state) => state.setCommentSelected);

  const setKeywordTitleList = useKeywordStore((state) => state.setKeywordTitleList);
  const keywordTitleList = useKeywordStore((state) => state.keywordTitleList);

  useEffect(() => {
    setKeywordTitleList(data.keywordTitles);
  }, []);

  const commentTypeKey = Object.keys(commentType) as Array<commentType>;

  const submit = async () => {
    setIsLoading(true);
    const commentsToSend = convertCommentArrToPatch(comments);
    try {
      const result: boolean = await newsRepositories.postNews({
        summary: content,
        title,
        subTitle,
        slug,
        state,
        isPublished,
        opinionLeft,
        opinionRight,
        newsImage: newsImg,
        timeline,
        comments: commentsToSend,
        keywords: keywordList,
      });
      if (result) {
        //setSummary('');
        alert('저장되었습니다~');
        router.reload();
      } else {
        alert('안감');
      }
    } catch (e) {
      alert('안감');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const editComment = (comment: CommentsArr) => {
    let index = null;
    for (let i = 0; i < comments.length; i++) {
      const cur = comments[i];
      if (cur.type === comment.type) {
        index = i;
        break;
      }
    }

    if (index === null) return;
    const newComments = complexClone(comments);
    newComments[index] = comment;
    setComments(newComments);
    setCommentSelected(comment);
  };

  return (
    <>
      <ProtectedLayout>
        <Wrapper>
          <TextEditWrapper>
            <ContentEditWrapper>
              <InputWrapper className="pb-1 pt-1 mb-1">
                <InputTitle>제목</InputTitle>
                <Input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.currentTarget.value);
                  }}
                ></Input>
              </InputWrapper>
              <InputWrapper className="pb-1 pt-1 mb-1">
                <InputTitle>부제목</InputTitle>
                <Input
                  type="text"
                  className="form-control"
                  value={subTitle}
                  onChange={(e) => {
                    setSubTitle(e.currentTarget.value);
                  }}
                ></Input>
                <InputTitle>슬러그 (Url 뒤에 붙을거임)</InputTitle>
                <Input
                  type="text"
                  className="form-control"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.currentTarget.value);
                  }}
                ></Input>
              </InputWrapper>
              <InputWrapper className="pb-1 pt-1 mb-1">
                <ImageUpload setImageUrl={setNewsImg} />
              </InputWrapper>
              <TextEditor ref={ref} style={{ height: '600px' }} onChange={handleContents} />
              <StateToggleWrapper>
                <InputWrapper className="pb-1 pt-1 mb-1">
                  <ToggleTitle>최신 아티클</ToggleTitle>
                  <ToggleButton
                    state={state}
                    setState={setState}
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
                    state={isPublished}
                    setState={setIsPublished}
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
                <SubmitButton
                  title={'키워드 선택하기'}
                  click={() => {
                    setIsSelectorModalUp(true);
                  }}
                />
                <KeywordWrapper>
                  {keywordList.map((keyword, idx) => {
                    return <KeywordLi key={idx}>{keyword.keyword}</KeywordLi>;
                  })}
                </KeywordWrapper>
              </KeywordSetter>
            </ContentEditWrapper>
            <NewsPreviewWrapper>
              <NewsContentPreview
                title={title}
                content={content}
                state={state}
                keywords={keywordList.map((k) => k.keyword)}
              />
            </NewsPreviewWrapper>
          </TextEditWrapper>
          <ContentWrapper className="mb-5">
            <TimelineInput timeline={timeline} handleTimeline={setTimeline} />
            <CommentInput comments={comments} setComments={setComments} />
            <OpinionWrapper className="d-flex flex-row  align-items-center mb-3 mt-3">
              <InputTitle>의견</InputTitle>
              <InputBody className="d-flex flex-row align-items-center w-100">
                <OpinionLeft>왼쪽</OpinionLeft>
                <Input
                  type="text"
                  className="form-control"
                  value={opinionLeft}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setOpinionLeft(v);
                  }}
                ></Input>
                <OpinionRight>오른쪽</OpinionRight>
                <Input
                  type="text"
                  className="form-control"
                  value={opinionRight}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setOpinionRight(v);
                  }}
                ></Input>
              </InputBody>
            </OpinionWrapper>

            <SubmitWrapper>
              <SubmitButton
                title="SUBMIT"
                click={() => {
                  if (isLoading) return;
                  submit();
                }}
              />
            </SubmitWrapper>
            <KeywordSelect curKeywordList={keywordList} setCurKeywordList={setKeywordList} />
            <CommentModal editComment={editComment} />
          </ContentWrapper>
        </Wrapper>
      </ProtectedLayout>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  padding-top: 100px;
  & {
    div.img-file {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
    }
  }
`;

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

const ContentWrapper = styled.div`
  width: 100%;
`;

const StateToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0;
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

const SubInputTitle = styled.div`
  width: 50px;
  font-size: 18px;
`;

const Input = styled.input``;

const SubInput = styled.input`
  width: 200px;
`;

const TimelineInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LayerTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const LayerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow-x: scroll;
`;

const NewsInputLayer = styled.div`
  display: flex;
  flex-direction: column;
  div.input_layer_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    div.left-right-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      div.order-button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  div.button_wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const JournalLayer = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  div.input_layer_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    div.left-right-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      div.order-button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  div.button_wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const BlankLayer = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: 220px;
  width: 280px;
`;

const Plus = styled.div`
  cursor: pointer;
`;

const OpinionWrapper = styled.div``;

const InputBody = styled.div`
  gap: 20px;
`;

const CommentSelect = styled.select`
  width: 200px;
`;

const Select = styled.select``;

const Button = styled.button``;

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
