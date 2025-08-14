import { NewsOrg } from '@/interface/news';
import { NewsSelector } from '@components/news/newsSelector';
import { useCallback } from 'react';
import { useModal } from '../useModal';

export function useOpenNewsSearch() {
  const { show, close } = useModal();

  const open = useCallback(
    ({ searchWord, selectNews }: { searchWord: string; selectNews: (news: NewsOrg) => void }) => {
      show(<NewsSelector searchWord={searchWord} selectNews={selectNews} close={close} />);
    },
    [show],
  );

  return {
    open,
    close,
  };
}
