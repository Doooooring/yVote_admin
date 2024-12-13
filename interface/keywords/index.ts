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
  keywordImage: string | null;
  news: Array<News>;
}

export interface KeywordToView
  extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'recent' | 'keywordImage'> {}

export interface KeywordOnDetail
  extends Pick<Keyword, 'id' | 'keyword' | 'explain' | 'category' | 'keywordImage'> {}

export interface KeywordToPatch
  extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'keywordImage' | 'explain'> {
  news: {
    id: number;
    title: string;
  }[];
}

export interface KeywordToPost extends Omit<KeywordToPatch, 'id'> {}

export interface KeywordTitle extends Pick<Keyword, 'id' | 'keyword'> {}
