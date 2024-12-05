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
  extends Partial<Pick<Keyword, 'id' | 'keyword' | 'explain' | 'category' | 'keywordImage'>> {}

export interface keywordToPatch
  extends Partial<Pick<Keyword, 'id' | 'keyword' | 'category' | 'explain'>> {
  news: {
    id: number;
    title: string;
  }[];
}

export interface keywordToPost extends Partial<Pick<Keyword, 'keyword' | 'category' | 'explain'>> {
  news: {
    id: number;
    title: string;
  }[];
}
export interface KeywordTitle extends Partial<Pick<Keyword, 'id' | 'keyword'>> {}
