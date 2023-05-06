import { create } from 'zustand';

import { News } from '@interface/news';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}

interface NewsState {
  newsTitleList: Array<NewsTitle>;
}

interface NewsAction {
  setNewsTitleList: (newList: Array<NewsTitle>) => void;
}

export const useNewsStore = create<NewsState & NewsAction>((set) => ({
  newsTitleList: [],

  setNewsTitleList: (newArray: Array<NewsTitle>) => {
    set(() => ({
      newsTitleList: newArray,
    }));
  },
}));
