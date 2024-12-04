import { create } from 'zustand';

import { commentType, NewsTitle } from '@interface/news';

interface NewsState {
  newsTitleList: Array<NewsTitle>;
  commentSelected: null | { type: commentType; data: Array<{ title: string; comment: string }> };
}

interface NewsAction {
  setCommentSelected: (
    state: {
      type: commentType;
      data: Array<{ title: string; comment: string }>;
    } | null,
  ) => void;
  setNewsTitleList: (newList: Array<NewsTitle>) => void;
}

export const useNewsStore = create<NewsState & NewsAction>((set) => ({
  newsTitleList: [],
  commentSelected: null,
  setCommentSelected: (
    state: {
      type: commentType;
      data: Array<{ title: string; comment: string }>;
    } | null,
  ) => {
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
