import { News } from '@interface/news';

export enum KeywordCategory {
  Human = 'human',
  Politics = 'politics',
  Policy = 'policy',
  Economics = 'economics',
  Social = 'social',
  Organization = 'organization',
  Etc = 'etc',
}

export interface Keyword {
  id: number;
  keyword: string;
  explain: string;
  category: KeywordCategory;
  recent: boolean;
  keywordImage: string;
  news: Array<News>;
}

export interface KeywordToView
  extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'recent' | 'keywordImage'> {}

export interface KeywordOnDetail
  extends Pick<Keyword, 'id' | 'keyword' | 'explain' | 'category' | 'keywordImage'> {}

export interface keywordToPatch extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'explain'> {
  news: {
    id: number;
    title: string;
  }[];
}

export interface keywordToPost extends Pick<Keyword, 'keyword' | 'category' | 'explain'> {
  news: {
    id: number;
    title: string;
  }[];
}
export interface KeywordTitle extends Pick<Keyword, 'id' | 'keyword'> {}
