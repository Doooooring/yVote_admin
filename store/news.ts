import { create } from 'zustand';

import { commentType, NewsTitle } from '@interface/news';

interface NewsState {
  newsTitleList: Array<NewsTitle>;
  commentSelected: null | commentType;
}

interface NewsAction {
  setCommentSelected: (state: commentType | null) => void;
  setNewsTitleList: (newList: Array<NewsTitle>) => void;
}

export const useNewsStore = create<NewsState & NewsAction>((set) => ({
  newsTitleList: [],
  commentSelected: null,
  setCommentSelected: (state: commentType | null) => {
    set(() => ({
      commentSelected: state,
    }));
  },
  setNewsTitleList: (newArray: Array<NewsTitle>) => {
    set(() => ({
      newsTitleList: newArray,
    }));
  },
}));
