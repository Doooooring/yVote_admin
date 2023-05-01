import { category as Category, Keyword } from '@interface/keywords';
import { useState } from 'react';
import styled from 'styled-components';

export default function KeywordPost() {
  const [keyword, setKeyword] = useState<string>('');
  const [explain, setExplain] = useState<string>('');
  const [category, setCategory] = useState<Keyword['category']>(Category.human);
  const [newsList, setNewsList] = useState<Array<number>>([]);

  return (
    <Wrapper>
      <Input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.currentTarget.value);
        }}
      ></Input>
      <Input
        value={explain}
        onChange={(e) => {
          setExplain(e.currentTarget.value);
        }}
      ></Input>
      <Select
        value={category}
        onChange={(e) => {
          setCategory(e.currentTarget.value as Category);
        }}
      >
        <option value={Category.human}>인물</option>
        <option value={Category.politics}>정치</option>
        <option value={Category.policy}>정책</option>
        <option value={Category.economics}>경제</option>
        <option value={Category.social}>사회</option>
        <option value={Category.organization}>조직</option>
        <option value={Category.etc}>기타</option>
      </Select>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const Input = styled.input``;
const Select = styled.select``;
