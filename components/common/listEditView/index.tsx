import { ReactNode } from 'react';
import styled from 'styled-components';
import { Center, Column, Row } from '../figure';

export default function ListEditView({
  title,
  listView,
  editView,
  isRightOpen,
}: {
  title: string;
  listView: ReactNode;
  editView: ReactNode;
  isRightOpen: boolean;
}) {
  return (
    <Wrapper>
      <LayerTitleWrapper>
        <InputTitle>{title}</InputTitle>
      </LayerTitleWrapper>
      <RowLayer>
        <LeftWrapper id="timeline-scroll">
          <LeftColumnLayer>{listView}</LeftColumnLayer>
        </LeftWrapper>
        {isRightOpen ? <RightWrapper>{editView}</RightWrapper> : <></>}
      </RowLayer>
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
  gap: 10px;
`;

const LeftColumnLayer = styled(Column)`
  gap: 10px;
`;

const LeftWrapper = styled(Layer)`
  overflow-y: scroll;
`;

const RightWrapper = styled(Layer)``;

const InputTitle = styled.div`
  flex: 1 0 auto;
  font-size: 16px;
  font-weight: bold;
  padding: 0 1rem;
  color: black;
`;
