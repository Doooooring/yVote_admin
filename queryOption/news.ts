import { newsRepositories } from '@/repositories/news';
import { queryOptions } from '@tanstack/react-query';

export const getNewsListQueryOption = ({ searchWord }: { searchWord: string }) =>
  queryOptions({
    queryKey: ['getNewsListQueryOption', searchWord],
    queryFn: () => newsRepositories.getNewsTitles(searchWord),
  });
