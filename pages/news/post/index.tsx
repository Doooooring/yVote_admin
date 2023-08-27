import { News, commentType } from '@interface/news';
import { useCommonStore } from '@store/common';
import { changeItemsOrder, clone } from '@utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { SubmitButton } from '@components/common/button';
import CommentModal from '@components/news/commenModal';
import KeywordSelect from '@components/news/keywordSelect';
import { Keyword } from '@interface/keywords';
import { keywordRepositories } from '@repositories/keyword';
import { newsRepositories } from '@repositories/news';
import { useKeywordStore } from '@store/keyword';
import { useNewsStore } from '@store/news';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}
interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
    keywordTitles: Array<any>;
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
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [timeline, setTimeline] = useState<News['timeline']>([
    {
      date: '2022.08',
      title: '테스트 제목입니다',
    },
    {
      date: '2022.09',
      title: '테스트 제목입니다',
    },
    {
      date: '2022.10',
      title: '테스트 제목입니다',
    },
  ]);
  const [state, setState] = useState<boolean>(true);
  const [opinions, setOpinions] = useState<News['opinions']>({
    left: 'aaaaaaa',
    right: 'bbbbbbbbbb',
  });
  const [comments, setComments] = useState<
    Array<{
      type: commentType;
      data: Array<{ title: string; comment: string }>;
    }>
  >([]);
  const [keywordList, setKeywordList] = useState<Array<string>>([]);

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
      const result: boolean = await newsRepositories.postNews({
        summary,
        title,
        state,
        opinions,
        timeline,
        comments: commentsToSend,
        keywords: keywordList,
      });
      if (result) {
        setSummary('');
        setTitle('');
        setTimeline([]);
        setState(true);
        setOpinions({
          left: '',
          right: '',
        });
        setComments([]);
        setKeywordList([]);
        alert('잘감');
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
  };

  const addComments = (idx: number) => {
    if (commentRest.length === 0) return;
    const curComments = clone(comments);
    const curType = commentRest[0];
    const newComment = { type: curType, data: [] };
    curComments.splice(idx + 1, 0, newComment);
    setComments(curComments);
  };

  const deleteComments = useCallback(
    (idx: number) => {
      const curComments = clone(comments);
      curComments.splice(idx, 1);
      setComments(curComments);
    },
    [comments],
  );

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
      <ContentWrapper className="mb-5">
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
          <InputTitle>설명</InputTitle>
          <Input
            type="textarea"
            className="form-control"
            placeholder="의도적으로 줄 넘기고 싶으면 $ 넣기"
            value={summary}
            onChange={(e) => {
              setSummary(e.currentTarget.value);
            }}
          ></Input>
        </InputWrapper>
        <TimelineInputWrapper className="pb-1 pt-1 mb-1">
          <LayerTitleWrapper>
            <InputTitle>타임 라인</InputTitle>
          </LayerTitleWrapper>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {timeline.map((item, idx) => {
              return (
                <NewsInputLayer className="shadow p-3 bg-white rounded">
                  <div className="input_layer_header">
                    <div className="button_wrapper">
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
            <BlankLayer className="shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addTimeline(timeline.length);
                }}
              >
                +
              </Plus>
            </BlankLayer>
          </LayerWrapper>
        </TimelineInputWrapper>
        {/* <TimelineInputWrapper className="pb-1 pt-1 mb-1">
          <LayerTitleWrapper>
            <InputTitle>관련 뉴스</InputTitle>
          </LayerTitleWrapper>
          <LayerWrapper className="px-3 pb-3 pt-3">
            {comments.map((comment, idx) => {
              return (
                <NewsInputLayer key={idx} className="shadow p-3 bg-white rounded">
                  <div className="button_wrapper">
                    <Button className="btn btn-primary" onClick={() => addNews(idx)}>
                      {' '}
                      추가{' '}
                    </Button>
                    <Button className="btn btn-secondary" onClick={() => deleteNews(idx)}>
                      {' '}
                      삭제{' '}
                    </Button>
                  </div className="button_wrapper">
                  <InputWrapper>
                    <SubInputTitle>날짜</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      placeholder="xxxx.xx 형식으로 넣으세요"
                      value={news.date}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].date = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>링크</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.link}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].link = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.title}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].title = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                </NewsInputLayer>
              );
            })}
            <BlankLayer className="shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addNews(comments.length);
                }}
              >
                +
              </Plus>
            </BlankLayer>
          </LayerWrapper>
        </TimelineInputWrapper> */}
        {/* <NewsInputWrapper className="pb-1 pt-1 mb-1">
          <LayerTitleWrapper>
            <InputTitle>관련 뉴스</InputTitle>
          </LayerTitleWrapper>
         <LayerWrapper className="px-3 pb-3 pt-3">
            {comments.map((news, idx) => {
              return (
                <NewsInputLayer key={idx} className="shadow p-3 bg-white rounded">
                  <div className="button_wrapper">
                    <Button className="btn btn-primary" onClick={() => addNews(idx)}>
                      {' '}
                      추가{' '}
                    </Button>
                    <Button className="btn btn-secondary" onClick={() => deleteNews(idx)}>
                      {' '}
                      삭제{' '}
                    </Button>
                  </div className="button_wrapper">
                  <InputWrapper>
                    <SubInputTitle>날짜</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      placeholder="xxxx.xx 형식으로 넣으세요"
                      value={news.date}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].date = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>링크</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.link}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].link = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <SubInput
                      type="text"
                      className="form-control"
                      value={news.title}
                      onChange={(e) => {
                        const curComments = clone(comments);
                        curComments[idx].title = e.currentTarget.value;
                        setComments(curComments);
                      }}
                    ></SubInput>
                  </InputWrapper>
                </NewsInputLayer>
              );
            })}
            <BlankLayer className="shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addNews(comments.length);
                }}
              >
                +
              </Plus>
            </BlankLayer>
          </LayerWrapper>
        </NewsInputWrapper> */}
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
            <BlankLayer className="shadow p-3 bg-white rounded justify-content-center align-items-center">
              <Plus
                onClick={() => {
                  addComments(comments.length);
                }}
              >
                +
              </Plus>
            </BlankLayer>
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
        <OpinionWrapper className="d-flex flex-row  align-items-center mb-3 mt-3">
          <InputTitle>의견</InputTitle>
          <InputBody className="d-flex flex-row align-items-center w-100">
            <OpinionLeft>왼쪽</OpinionLeft>
            <Input
              type="text"
              className="form-control"
              value={opinions.left}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.left = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>

            <OpinionRight>오른쪽</OpinionRight>
            <Input
              type="text"
              className="form-control"
              value={opinions.right}
              onChange={(e) => {
                const curOpinions = clone(opinions);
                curOpinions.right = e.currentTarget.value;
                setOpinions(curOpinions);
              }}
            ></Input>
          </InputBody>
        </OpinionWrapper>

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
  & {
    div.img-file {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 50%;
  min-width: 60rem;
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
  width: 100px;
  font-size: 18px;
  font-weight: bold;
`;

const OpinionTitle = styled.div`
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
  overflow: scroll;
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

const SubmitWrapper = styled.div``;
