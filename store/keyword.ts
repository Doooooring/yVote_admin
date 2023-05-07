import { create } from 'zustand';

import { Keyword } from '@interface/keywords';

interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

interface KeywordState {
  keywordTitleList: Array<KeywordTitle>;
}

interface KeywordAction {
  setKeywordTitleList: (newList: Array<KeywordTitle>) => void;
}

export const useKeywordStore = create<KeywordState & KeywordAction>((set) => ({
  keywordTitleList: [],
  setKeywordTitleList: (newArray: Array<KeywordTitle>) => {
    set(() => ({
      keywordTitleList: newArray,
    }));
  },
}));
