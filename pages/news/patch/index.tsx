import { SubmitButton } from '@components/common/button';
import TextEditor from '@components/common/textEditor';
import ToggleButton from '@components/common/toggleButton';
import SearchBox from '@components/keyword/search';
import { SearchState } from '@components/keyword/searchState';
import CommentModal from '@components/news/commenModal';
import IdSelector from '@components/news/idSelector';
import KeywordSelect from '@components/news/keywordSelect';
import NewsContentPreview from '@components/news/newsContentPreview';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Keyword } from '@interface/keywords';
import { News, commentType } from '@interface/news';
import { keywordRepositories } from '@repositories/keyword';
import { NewsToPatch, newsRepositories } from '@repositories/news';
import { useCommonStore } from '@store/common';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';
import { changeItemsOrder, clone } from '@utils';
import { useReactQuill } from '@utils/hook/useReactQuill';

import 'bootstrap/dist/css/bootstrap.min.css';

import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}
interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

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

export default function NewsPatch({ data }: pageProps) {
  const { ref, content, handleContents, initializeQuillContents, resetContents } = useReactQuill();

  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [timeline, setTimeline] = useState<News['timeline']>([]);
  const [state, setState] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [opinions, setOpinions] = useState<News['opinions']>({
    left: '',
    right: '',
  });
  const [comments, setComments] = useState<
    Array<{
      type: commentType;
      data: Array<{ title: string; comment: string }>;
    }>
  >([]);
  const [keywordList, setKeywordList] = useState<Array<string>>([]);

  const [newsSearchList, setNewsSearchList] = useState<NewsTitle[]>([]);
  const [newsSearchErr, setNewsSearchErr] = useState<boolean>(false);
  const [newsSelectorUp, setNewsSelectorup] = useState<boolean>(false);

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

  const findNews = useCallback(async (searchWord: string) => {
    try {
      setIsLoading(true);
      const response = await newsRepositories.getNewsTitles(searchWord);
      if (response.length == 0) {
        Error;
      } else {
        setNewsSearchList(response);
        setNewsSelectorup(true);
        setIsLoading(false);
      }
      return true;
    } catch {
      setTitle('');
      setNewsSearchErr(true);
      setIsLoading(false);

      return false;
    }
  }, []);

  const getNews = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await newsRepositories.getNewsDetails(id);
      if (response === false) Error();
      else {
        const {
          _id,
          title,
          summary,
          keywords,
          state,
          isPublished,
          timeline,
          opinions,
          comments,
        }: NewsToPatch = response;

        setId(_id);
        setTitle(title!);
        //setSummary(summary!);
        initializeQuillContents(summary!);
        setTimeline(timeline);
        setKeywordList(keywords!);
        setState(state!);
        setIsPublished(isPublished ?? true);
        setOpinions(opinions!);

        /**
         * @FIXME comment process error
         */
        if (Array.isArray(comments)) {
          setComments([]);
        } else {
          const curCommentKeys = Object.keys(comments ?? {}) as commentType[];
          const commentsToStore = curCommentKeys.map((comment) => {
            return {
              type: comment,
              data: comments[comment]!,
            };
          });
          setComments(commentsToStore);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submit = async () => {
    setIsLoading(true);

    const commentsToSend = {} as {
      [key in commentType]?: Array<{
        title: string;
        comment: string;
      }>;
    };
    comments.forEach((item) => {
      const { type, data } = item;
      commentsToSend[type] = data;
    });

    try {
      const result: boolean = await newsRepositories.patchNews({
        _id: id,
        summary: content,
        title,
        state,
        isPublished,
        opinions,
        timeline,
        comments: commentsToSend,
        keywords: keywordList,
      });
      if (!result) {
        Error();
        return;
      }

      setId('');
      //setSummary('');
      resetContents();
      setTitle('');
      setTimeline([]);
      setState(true);
      setIsPublished(true);
      setOpinions({
        left: '',
        right: '',
      });
      setKeywordList([]);

      return result;
    } catch (e) {
      alert('다시 시도해보세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const commentRest: commentType[] = useMemo(() => {
    const curComments = comments;
    let restComment: commentType[] = [];
    commentTypeKey.forEach((commentType) => {
      const result = curComments.filter((comment) => {
        return comment.type === commentType;
      });
      if (result.length === 0) {
        restComment.push(commentType);
      }
    });
    return restComment;
  }, [comments]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const editComment = (comment: {
    type: commentType;
    data: Array<{ title: string; comment: string }>;
  }) => {
    let index = null;
    for (let i = 0; i < comments.length; i++) {
      const cur = comments[i];
      if (cur.type === comment.type) {
        index = i;
        break;
      }
    }

    if (index === null) return;
    const newComments = clone(comments);
    newComments[index] = comment;
    setComments(newComments);
    setCommentSelected(comment);
  };

  const addComments = (idx: number) => {
    if (commentRest.length === 0) return;
    const curComments = clone(comments);
    const curType = commentRest[0];
    const newComment = { type: curType, data: [] };
    curComments.splice(idx + 1, 0, newComment);
    setComments(curComments);
  };

  const deleteComments = (idx: number) => {
    const curComments = clone(comments);
    curComments.splice(idx, 1);
    setComments(curComments);
  };

  const moveCommentLeft = (idx: number) => {
    if (idx === 0) return;

    const newComments = changeItemsOrder(comments, idx, idx - 1);
    setComments(newComments);
  };

  const moveCommentRight = (idx: number) => {
    if (idx === comments.length - 1) return;

    const newComments = changeItemsOrder(comments, idx, idx + 1);
    setComments(newComments);
  };

  const addTimeline = (idx: number) => {
    const curTimeline = clone(timeline);
    const newData = { date: '', title: '' };
    curTimeline.splice(idx + 1, 0, newData);
    setTimeline(curTimeline);
  };

  const deleteTimeline = (idx: number) => {
    const curTimeline = clone(timeline);
    curTimeline.splice(idx, 1);
    setTimeline(curTimeline);
  };

  const moveTimelineLeft = (idx: number) => {
    if (idx === 0) return;

    const newTimeline = changeItemsOrder(timeline, idx, idx - 1);
    setTimeline(newTimeline);
  };

  const moveTimelineRight = (idx: number) => {
    if (idx === timeline.length - 1) return;

    const newTimline = changeItemsOrder(timeline, idx, idx + 1);
    setTimeline(newTimline);
  };

  return (
    <Wrapper>
      <SearchBox findKeyword={findNews} />
      <IdSelector
        newsSearchList={newsSearchList}
        getNews={getNews}
        newsSelectorUp={newsSelectorUp}
        setNewsSelectorUp={setNewsSelectorup}
      />
      <TextEditWrapper state={id === ''}>
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
          <TextEditor ref={ref} style={{ height: '600px' }} onChange={handleContents} />
          <StateToggleWrapper>
            <InputWrapper className="pb-1 pt-1 mb-1">
              <ToggleTitle>최신 아티클</ToggleTitle>
              {/* <Select
              className="form-control"
              value={state === true ? 'true' : 'false'}
              onChange={(e) => {
                if (e.currentTarget.value === 'true') {
                  setState(true);
                } else {
                  setState(false);
                }
              }}
              >
              <option value={'true'}>최신</option>
              <option value={'false'}>구닥다리</option>
            </Select> */}
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
              {/* <Select
              className="form-control"
              value={isPublished === true ? 'true' : 'false'}
              onChange={(e) => {
                if (e.currentTarget.value === 'true') {
                  setIsPublished(true);
                } else {
                  setIsPublished(false);
                }
              }}
              >
              <option value={'true'}>출간하기</option>
              <option value={'false'}>김민재만 보기</option>
            </Select> */}
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
                return <KeywordLi key={idx}>{keyword}</KeywordLi>;
              })}
            </KeywordWrapper>
          </KeywordSetter>
        </ContentEditWrapper>
        <NewsPreviewWrapper>
          <NewsContentPreview
            title={title}
            content={content}
            state={state}
            keywords={keywordList}
          />
        </NewsPreviewWrapper>
      </TextEditWrapper>
      <ContentWrapper className="mb-5" state={id === ''}>
        <TimelineInputWrapper className="pb-1 pt-1 mb-1">
          <LayerTitleWrapper>
            <InputTitle>타임 라인</InputTitle>
          </LayerTitleWrapper>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {timeline.map((item, idx) => {
              return (
                <NewsInputLayer className="shadow p-3 bg-white rounded">
                  <div className="input_layer_header">
                    <div className="button-wrapper">
                      <Button className="btn btn-primary" onClick={() => addTimeline(idx)}>
                        {' '}
                        추가{' '}
                      </Button>
                      <Button className="btn btn-secondary" onClick={() => deleteTimeline(idx)}>
                        {' '}
                        삭제{' '}
                      </Button>
                    </div>
                    <div className="left-right-buttons">
                      <div className="left order-button" onClick={() => moveTimelineLeft(idx)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </div>
                      <div className="right order-button" onClick={() => moveTimelineRight(idx)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </div>
                    </div>
                  </div>
                  <InputWrapper>
                    <SubInputTitle>날짜</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={item.date}
                      onChange={(e) => {
                        const curTimeline = clone(timeline);
                        curTimeline[idx].date = e.currentTarget.value;
                        setTimeline(curTimeline);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={item.title}
                      onChange={(e) => {
                        const curTimeline = clone(timeline);
                        curTimeline[idx].title = e.currentTarget.value;
                        setTimeline(curTimeline);
                      }}
                    ></SubInput>
                  </InputWrapper>
                </NewsInputLayer>
              );
            })}
            <div className="blank-layer shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addTimeline(timeline.length);
                }}
              >
                +
              </Plus>
            </div>
          </LayerWrapper>
        </TimelineInputWrapper>
        <CommentWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>평론</InputTitle>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {comments.map((comment, idx) => {
              return (
                <JournalLayer key={idx} className="shadow p-3 bg-white rounded">
                  <div className="input_layer_header">
                    <div className="button_wrapper">
                      <Button className="btn btn-primary" onClick={() => addComments(idx)}>
                        {' '}
                        추가{' '}
                      </Button>
                      <Button className="btn btn-secondary" onClick={() => deleteComments(idx)}>
                        {' '}
                        삭제{' '}
                      </Button>
                    </div>
                    <div className="left-right-buttons">
                      <div className="left order-button" onClick={() => moveCommentLeft(idx)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </div>
                      <div className="right order-button" onClick={() => moveCommentRight(idx)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </div>
                    </div>
                  </div>
                  <InputWrapper>
                    <SubInputTitle>평론 타입</SubInputTitle>
                    <CommentSelect
                      className="form-select"
                      value={comment.type}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].type = e.currentTarget.value as commentType;
                        setComments(curComments);
                      }}
                    >
                      {commentTypeKey.map((comment, idx) => {
                        return (
                          <option key={comment + JSON.stringify(idx)} value={comment}>
                            {comment}
                          </option>
                        );
                      })}
                    </CommentSelect>
                    <div
                      className="comment-modal-button btn btn-primary"
                      onClick={() => setCommentSelected(comment)}
                    >
                      내용 채우기
                    </div>
                  </InputWrapper>
                </JournalLayer>
              );
            })}
            <div className="blank-layer shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addComments(comments.length);
                }}
              >
                +
              </Plus>
            </div>
          </LayerWrapper>
        </CommentWrapper>
        <InputWrapper className="pb-1 pt-1 mb-1">
          <InputTitle>상태</InputTitle>
          <Select
            className="form-control"
            value={state === true ? 'true' : 'false'}
            onChange={(e) => {
              if (e.currentTarget.value === 'true') {
                setState(true);
              } else {
                setState(false);
              }
            }}
          >
            <option value={'true'}>최신</option>
            <option value={'false'}>구닥다리</option>
          </Select>
        </InputWrapper>
        <KeywordSetter>
          <SubmitButton
            title={'키워드 선택하기'}
            click={() => {
              setIsSelectorModalUp(true);
            }}
          />
          <KeywordWrapper>
            {keywordList.map((keyword, idx) => {
              return <KeywordLi key={idx}>{keyword}</KeywordLi>;
            })}
          </KeywordWrapper>
        </KeywordSetter>
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
      <SearchState searchErr={newsSearchErr} loading={isLoading} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  font-size: 18px;
  padding-top: 100px;
`;

interface ContentWrapperProps {
  state: boolean;
}

const TextEditWrapper = styled.div<ContentWrapperProps>`
  width: 100%;
  display: ${({ state }) => (state ? 'none' : 'flex')};

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

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: ${({ state }) => (state ? 'none' : 'block')};
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

const NewsInputWrapper = styled.div`
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
  overflow: scroll;

  div.blank-layer {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    height: 220px;
    width: 280px;
  }
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
        cursor: pointer;
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

const JournalsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const JournalLayer = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 220px;
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
        cursor: pointer;
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

const PressSelect = styled.select`
  width: 200px;
`;

const Select = styled.select``;

const div = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

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

const SubmitWrapper = styled.div``;
