import { commentType } from '@interface/news';
import { useNewsStore } from '@store/news';
import { changeItemsOrder, clone } from '@utils';
import styled from 'styled-components';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CommentModalProps {
  editComment: (v: { type: commentType; data: Array<{ title: string; comment: string }> }) => void;
}

export default function CommentModal({ editComment }: CommentModalProps) {
  const [commentSelected, setCommentSelected] = useNewsStore((state) => [
    state.commentSelected,
    state.setCommentSelected,
  ]);

  const addComments = (idx: number) => {
    const curComment = clone(commentSelected);
    const curComments = curComment?.data!;
    curComments.splice(idx + 1, 0, {
      title: '',
      comment: '',
    });
    editComment(curComment!);
    setCommentSelected(curComment);
  };

  const deleteComments = (idx: number) => {
    const curComment = clone(commentSelected);
    const curComments = curComment?.data!;
    curComments.splice(idx, 1);
    editComment(curComment!);
    setCommentSelected(curComment);
  };

  const moveCommentUp = (idx: number) => {
    if (idx === 0) return;
    const curComment = clone(commentSelected);
    const curComments = curComment?.data!;
    const newComments = changeItemsOrder(curComments, idx - 1, idx);
    curComment!.data = newComments as {
      title: string;
      comment: string;
    }[];
    editComment(curComment!);
  };
  
  const moveCommentDown = (idx: number) => {
    const curComment = clone(commentSelected);
    const curComments = curComment?.data!;
    if (idx === curComments.length - 1) return;
    const newComments = changeItemsOrder(curComments, idx, idx + 1);
    curComment!.data = newComments as {
      title: string;
      comment: string;
    }[];
    editComment(curComment!);
  };

  return commentSelected !== null ? (
    <Wrapper
      state={commentSelected !== null}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setCommentSelected(null);
        }
      }}
    >
      <div className="dialog">
        <div className="dialog-head p-3">{commentSelected.type}</div>
        <div className="dialog-body p-3">
          {commentSelected.data.map((comment, idx) => {
            return (
              <InputLayer key={idx} className="shadow p-3 bg-white rounded">
                <div className="button-wrapper">
                  <button className="btn btn-primary" onClick={() => addComments(idx)}>
                    추가
                  </button>
                  <button className="btn btn-secondary" onClick={() => deleteComments(idx)}>
                    제거
                  </button>
                  <div className="left-right-buttons">
                    <div
                      className="left order-button"
                      onClick={() => {
                        moveCommentUp(idx);
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} />
                    </div>
                    <div
                      className="right order-button"
                      onClick={() => {
                        moveCommentDown(idx);
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="input-wrapper">
                  <div className="sub-input-title">제목</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="제목 입력하세요"
                    value={comment.title}
                    onChange={(e) => {
                      const curComment = clone(commentSelected);
                      const curInput = curComment.data[idx];
                      curInput.title = e.target.value;
                      editComment(curComment);
                      setCommentSelected(curComment);
                    }}
                  ></input>
                </div>
                <div className="input-wrapper">
                  <div className="sub-input-title">내용</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="내용 입력하세요"
                    value={comment.comment}
                    onChange={(e) => {
                      const curComment = clone(commentSelected);
                      const curInput = curComment.data[idx];
                      curInput.comment = e.target.value;
                      editComment(curComment);
                      setCommentSelected(curComment);
                    }}
                  ></input>
                </div>
              </InputLayer>
            );
          })}
          <InputLayer className="shadow p-3 bg-white rounded">
            <div
              className="plus"
              onClick={() => {
                addComments(commentSelected.data.length);
              }}
            >
              +
            </div>
          </InputLayer>
        </div>
      </div>
    </Wrapper>
  ) : (
    <></>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  height: 100%;
  display: ${({ state }) => (state ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0, 0.5);
  padding-bottom: 50px;
  z-index: 999;
  div.dialog {
    background-color: white;
    height: 600px;
    overflow: scroll;
  }
  div.dialog-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  div.blank-layer {
    display: flex;
    flex-direction: column;
    height: 220px;
    width: 280px;
  }
`;

const InputLayer = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 300px;
  justify-content: center;
  align-items: center;
  div.button-wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 10px;
  }
  div.input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  div.input-title {
    width: 100px;
    font-size: 18px;
    font-weight: bold;
  }
  div.sub-input-title {
    width: 50px;
    font-size: 18px;
  }
`;
