import { create } from 'zustand';

import { News, commentType } from '@interface/news';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}

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
