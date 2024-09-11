import { newsRepositories } from '@repositories/news';
import { useState } from 'react';

export const useTmpHook = () => {
  const [cnt, setCnt] = useState(0);
  const [maxCnt, setMaxCnt] = useState(0);

  const fixSummaryConvention = async () => {
    const newsTitles = await newsRepositories.getNewsTitles('');
    setMaxCnt(newsTitles.length);
    for (let i = 0; i < maxCnt; i++) {
      const { _id } = newsTitles[i];
      const news = await newsRepositories.getNewsDetails(_id as string);
      if (!news) continue;

      const { summary } = news;
      const summaryToPatch = '';
    }
  };
};
