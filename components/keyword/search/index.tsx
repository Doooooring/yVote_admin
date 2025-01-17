import styled from 'styled-components';

import { PrimaryButton } from '@components/common/button';
import { useState } from 'react';

interface SearchBoxProps {
  findKeyword: (word: string) => Promise<boolean>;
}

export default function SearchBox({ findKeyword }: SearchBoxProps) {
  const [searchWord, setSearchWord] = useState<string>('');
  return (
    <Wrapper>
      <InputWrapper>
        <InputTitle>검색</InputTitle>
        <Input
          type="text"
          value={searchWord}
          className="form-control"
          onChange={(e) => {
            setSearchWord(e.currentTarget.value);
          }}
        ></Input>
        <PrimaryButton
          title="검색"
          click={async () => {
            const response = await findKeyword(searchWord);
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
