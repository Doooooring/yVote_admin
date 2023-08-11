import { create } from 'zustand';

interface CommonState {
  isSelectorModalUp: boolean;
  isLoading: boolean;
}

interface CommonAction {
  setIsSelectorModalUp: (state: boolean) => void;
  setIsLoading: (state: boolean) => void;
}

export const useCommonStore = create<CommonState & CommonAction>((set) => ({
  isSelectorModalUp: false,
  isLoading: false,
  setIsSelectorModalUp: (state: boolean) => {
    set(() => ({
      isSelectorModalUp: state,
    }));
  },
  setIsLoading: (state: boolean) => {
    set(() => ({
      isLoading: state,
    }));
  },
}));
