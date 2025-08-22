import { CommonIconButton, PrimaryButton, TextButton } from '@/components/common/button';
import { Column, Row } from '@/components/common/figure';
import { CommentToEdit, commentType } from '@/interface/news';
import { complexClone } from '@/utils';
import { getStandardDateForm } from '@/utils/tools';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

type CommentForm = {
  title: string;
  comment: string;
  date?: Date;
};

function convertInputToCommentForm(input: string) {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const reg = /^\s*\[([^\]]+)\]\s*(.*)$/;
  let cur: CommentForm = { title: '', comment: '' };
  const result = [] as CommentForm[];

  lines.forEach((line) => {
    const m = reg.exec(line);
    if (!m) return;
    const key = m[1].toLocaleLowerCase();
    const val = m[2];

    if (key === 'title') {
      cur = { title: '', comment: '' };
      cur.title = val;
      result.push(cur);
    } else if (key === 'content') {
      cur.comment = val;
    } else if (key === 'date') {
      cur.date = new Date(val);
    }
  });

  return result.map((d, idx) => {
    return { ...d, order: result.length - idx };
  });
}

export function EditBulkComments({
  commentType,
  setComments,
  onBack,
}: {
  commentType: commentType;
  setComments: (comments: CommentToEdit[]) => void;
  onBack: () => void;
}) {
  const [curComments, setCurComments] = useState<CommentToEdit[]>([]);

  const [input, setInput] = useState<string>('');

  const onChangeInput = useCallback(
    function cb<T extends keyof CommentToEdit>(index: number, key: T, value: string) {
      setCurComments((curComments: CommentToEdit[]) => {
        const copied = complexClone(curComments);
        const comment = copied[index];

        switch (key) {
          case 'comment': {
            comment.comment = value;
            break;
          }
          case 'title': {
            comment.title = value;
            break;
          }
          case 'date': {
            const dateObj = new Date(value);
            const isValid = !isNaN(dateObj.valueOf());
            if (!isValid) break;
            comment.date = dateObj;
            break;
          }
        }
        return copied;
      });
    },
    [setCurComments],
  );

  return (
    <Wrapper>
      <LayerTitleWrapper>
        <InputTitle>대량 평론 붙여넣기</InputTitle>
      </LayerTitleWrapper>

      {/* <InputSubTitle>()</InputSubTitle> */}
      <RowLayer>
        <LeftWrapper>
          <textarea
            className="form-control"
            style={{
              width: '100%',
              height: '100%',
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </LeftWrapper>
        <CommonIconButton
          style={{
            width: '20px',
            height: '20px',
          }}
          onClick={() => {
            try {
              const response = convertInputToCommentForm(input);
              setCurComments(
                response.map((d) => {
                  return { ...d, commentType };
                }),
              );
            } catch (e) {
              alert('입력 양식을 맞춰주세요.');
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} width="12px" height="12px" />
        </CommonIconButton>
        <RightWrapper>
          <RightColumnLayer>
            {curComments.map((comment, index) => {
              return (
                <CommentInputLayer className="p-3">
                  <InputWrapper>
                    <SubInputTitle>제목</SubInputTitle>
                    <TitleInput
                      type="text"
                      className="form-control"
                      value={comment.title}
                      onChange={(e) => {
                        onChangeInput(index, 'title', e.target.value);
                      }}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>내용</SubInputTitle>
                    <TitleInput
                      type="text"
                      className="form-control"
                      value={comment.comment}
                      onChange={(e) => {
                        onChangeInput(index, 'comment', e.target.value);
                      }}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <SubInputTitle>날짜</SubInputTitle>
                    <DateInput
                      type="date"
                      min="1000-01-01"
                      max="9999-12-31"
                      className="form-control"
                      value={comment.date ? getStandardDateForm(comment.date!) : ''}
                      onChange={(e) => {
                        onChangeInput(index, 'date', e.target.value);
                      }}
                      onClick={(e) => {
                        if (e.currentTarget.showPicker) {
                          e.currentTarget.showPicker();
                        }
                      }}
                    />
                    <span style={{ paddingLeft: '0.5rem' }}>
                      {comment.date ? getStandardDateForm(comment.date!) : ''}
                    </span>
                  </InputWrapper>
                </CommentInputLayer>
              );
            })}
          </RightColumnLayer>
        </RightWrapper>
      </RowLayer>
      <Row
        style={{
          gap: '8px',
        }}
      >
        <TextButton
          onClick={() => {
            onBack();
          }}
        >
          {'뒤로가기'}
        </TextButton>
        <PrimaryButton
          title="추가하기"
          click={() => {
            setComments(curComments);
            onBack();
          }}
        />
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled(Column)`
  padding: 1rem;
`;

const Layer = styled.div`
  min-width: 300px;
  border: 0.8px solid rgb(200, 200, 200);
  border-radius: 20px;
  padding: 1rem;
`;

const LayerTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

const RowLayer = styled(Row)`
  height: 500px;
  flex: 0 1 auto;
  align-items: center;
  gap: 10px;
`;

const LeftColumnLayer = styled(Column)`
  gap: 10px;
`;

const LeftWrapper = styled(Layer)`
  width: 400px;
  height: 400px;
`;

const RightWrapper = styled(Layer)``;

const InputTitle = styled.div`
  flex: 1 0 auto;
  font-size: 16px;
  font-weight: bold;
  padding: 0 1rem;
  color: black;
`;

const InputSubTitle = styled.p``;

const CommentInputLayer = styled.div`
  width: 500px;
  gap: 10px;
  background-color: white;
  border: 0.8px solid rgb(170, 170, 170);
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 10px;

  p {
    font-size: 14px;
    margin: 0;
    padding: 0;
  }

  .date {
    font-weight: 700;
  }

  div.button_wrapper {
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-top: 5px;
  padding-bottom: 5px;
`;

const SubInputTitle = styled.div`
  width: 40px;
  flex: 0 0 auto;
  font-size: 14px;
`;

const DateInput = styled.input`
  width: 220px;
`;

const TitleInput = styled.input`
  width: 400px;
`;

const RightColumnLayer = styled.div`
  min-width: 500px;

  min-height: 100px;
  max-height: 500px;
  overflow: scroll;
  div.input_layer_header {
    display: flex;
    flex-direction: row;
  }
`;
