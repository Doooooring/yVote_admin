import styles from '../styles/Home.module.css';

import { GetServerSideProps } from 'next';

import { NewsTitle } from '@interface/news';
import { useEffect } from 'react';

import { newsRepositories } from '@repositories/news';
import { useNewsStore } from '@store/news';
import { useRouter } from 'next/router';

interface pageProps {
  data: {
    newsTitles: Array<NewsTitle>;
    keywordTitles: Array<any>;
  };
}

export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
  const newsTitles: Array<NewsTitle> = await newsRepositories.getNewsTitles('');
  return {
    props: {
      data: {
        newsTitles,
        keywordTitles: [],
      },
    },
  };
};

const Home = ({ data }: pageProps) => {
  const setNewsTitleList = useNewsStore((state) => state.setNewsTitleList);
  const router = useRouter();
  useEffect(() => {
    router.push('/news/edit');
    setNewsTitleList(data.newsTitles);
  }, []);

  return <div className={styles.container}></div>;
};

export default Home;
