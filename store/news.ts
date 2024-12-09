import { create } from 'zustand';

import { CommentToEdit, commentType, NewsTitle } from '@interface/news';

interface NewsState {
  newsTitleList: Array<NewsTitle>;
  commentSelected: null | { type: commentType; data: Array<CommentToEdit> };
}

interface NewsAction {
  setCommentSelected: (
    state: {
      type: commentType;
      data: Array<CommentToEdit>;
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
      data: Array<CommentToEdit>;
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
