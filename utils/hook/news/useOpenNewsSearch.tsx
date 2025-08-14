import { NewsSelector } from '@components/news/newsSelector';
import { useCallback } from '@node_modules/@types/react';
import { useModal } from '../useModal';

export function useOpenNewsSearch() {
  const { show, close } = useModal();

  const open = useCallback(
    ({ searchWord, selectNews }: { searchWord: string; selectNews: (newsId: number) => void }) => {
      show(<NewsSelector searchWord={searchWord} selectNews={selectNews} />);
    },
    [show],
  );
}
