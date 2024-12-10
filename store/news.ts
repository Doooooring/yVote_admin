import { create } from 'zustand';

import { CommentsArr, CommentToEdit, commentType, NewsTitle } from '@interface/news';

interface NewsState {
  newsTitleList: Array<NewsTitle>;
  commentSelected: null | CommentsArr;
}

interface NewsAction {
  setCommentSelected: (state: CommentsArr | null) => void;
  setNewsTitleList: (newList: Array<NewsTitle>) => void;
}

export const useNewsStore = create<NewsState & NewsAction>((set) => ({
  newsTitleList: [],
  commentSelected: null,
  setCommentSelected: (state: CommentsArr | null) => {
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
