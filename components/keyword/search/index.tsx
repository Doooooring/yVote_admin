import React, { useState } from 'react';
import styled from 'styled-components';

import { PrimaryButton } from '@components/common/button';

interface SearchBoxProps {
  setSearchWord: (word: string) => Promise<void> | void;
}

export default function SearchBox({ setSearchWord }: SearchBoxProps) {
  const [input, setInput] = useState<string>('');
  return (
    <Wrapper>
      <InputWrapper>
        <InputTitle>검색</InputTitle>
        <Input
          type="text"
          value={input}
          className="form-control"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.currentTarget.value);
          }}
        ></Input>
        <PrimaryButton
          title="검색"
          click={async () => {
            setSearchWord(input);
          }}
        />
      </InputWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 300px;
  margin-bottom: 30px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const InputTitle = styled.div`
  width: 200px;
  font-size: 18px;
`;

const Input = styled.input`
  text-align: center;
`;
