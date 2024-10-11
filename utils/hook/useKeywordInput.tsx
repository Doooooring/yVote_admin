import { category } from '@interface/keywords';
import { useState } from 'react';

interface KeywordInputs {
  keyword: string;
  category: category;
}

export const useKeywordInput = () => {
  const [keywordInputs, setKeywordInputs] = useState<KeywordInputs>({
    keyword: '',
    category: category.human,
  });

  const editKeyword = (s: string) => {
    setKeywordInputs((input) => {
      return { ...input, keyword: s };
    });
  };

  const editCategory = (s: category) => {
    setKeywordInputs((input) => {
      return { ...input, category: s };
    });
  };

  const initializeKeyword = (ne: KeywordInputs) => {
    setKeywordInputs(ne);
  };

  const resetKeyword = () => {
    initializeKeyword({ keyword: '', category: category.economics });
  };
  return {
    keywordInputs,
    editKeyword,
    editCategory,
    initializeKeyword,
    resetKeyword,
  };
};
