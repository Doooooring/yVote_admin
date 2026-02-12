import { CommentToEdit, commentType } from '@interface/news';
import { newsRepositories } from '@repositories/news';
import { getStandardDateForm } from '@/utils/tools';
import { useRef, useState } from 'react';

export const useFetchNewsComment = (id: number, comment: commentType | null, limit: number) => {
  const curPage = useRef(0);
  const [curComments, setCurComments] = useState<Array<CommentToEdit>>([]);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  async function fetchNewsComment(page: number) {
    try {
      setIsRequesting(true);
      const response = await newsRepositories.getNewsComment(id, comment!, page, limit);
      if (!response || response.length == 0) {
        return false;
      } else {
        const converted = response.map(c => ({
          ...c,
          date: c.date ? getStandardDateForm(c.date) : undefined
        }));
        setCurComments(converted);
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }

  const getPageBefore = async () => {
    if (curPage.current === 0) return false;
    curPage.current -= 10;
    const response = await fetchNewsComment(curPage.current);
    return response;
  };
  const getPageAfter = async () => {
    const response = await fetchNewsComment(curPage.current + 10);
    if (response) curPage.current += 10;
    return response;
  };

  return {
    page: curPage.current,
    curComments,
    isRequesting,
    init: () => {
      fetchNewsComment(0);
    },
    getPageBefore,
    getPageAfter,
  };
};
