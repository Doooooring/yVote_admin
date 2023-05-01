import { create } from 'zustand';

interface CommonState {
  isModalUp: boolean;
  isLoading: boolean;
}

interface CommonAction {
  setIsModalup: (state: boolean) => void;
  setIsLoading: (state: boolean) => void;
}

export const useCommonStore = create<CommonState & CommonAction>((set) => ({
  isModalUp: false,
  isLoading: false,
  setIsModalup: (state: boolean) => {
    set(() => ({
      isModalUp: state,
    }));
  },
  setIsLoading: (state: boolean) => {
    set(() => ({
      isLoading: state,
    }));
  },
}));
