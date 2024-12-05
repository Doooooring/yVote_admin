import { create } from 'zustand';

import { KeywordTitle } from '@interface/keywords';

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
