import { create } from 'zustand';

import { Keyword } from '@interface/keywords';

interface KeywordState {
  keywordList: Array<Keyword>;
}

interface KeywordAction {
  setKeywordList: (newList: Array<Keyword>) => void;
}

export const useNewsStore = create<KeywordState & KeywordAction>((set) => ({
  keywordList: [],
  setKeywordList: (newArray: Array<Keyword>) => {
    set(() => ({
      keywordList: newArray,
    }));
  },
}));
