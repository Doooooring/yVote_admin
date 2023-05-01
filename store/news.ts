import { create } from 'zustand';

import { News } from '@interface/news';

interface NewsTitle extends Partial<Pick<News, '_id' | 'title' | 'order'>> {}

interface NewsState {
  newsTitleList: Array<NewsTitle>;
  isModalUp: boolean;
}

interface NewsAction {
  setNewsTitleList: (newList: Array<NewsTitle>) => void;
  setIsModalup: (state: boolean) => void;
}

export const useNewsStore = create<NewsState & NewsAction>((set) => ({
  newsTitleList: [],
  isModalUp: false,
  setNewsTitleList: (newArray: Array<NewsTitle>) => {
    set(() => ({
      newsTitleList: newArray,
    }));
  },
  setIsModalup: (state: boolean) => {
    set(() => ({
      isModalUp: state,
    }));
  },
}));
