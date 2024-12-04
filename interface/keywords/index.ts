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
}

export interface KeywordToView
  extends Pick<Keyword, 'id' | 'keyword' | 'category' | 'recent' | 'keywordImage'> {}

export interface KeywordOnDetail
  extends Partial<Pick<Keyword, 'id' | 'keyword' | 'explain' | 'category' | 'keywordImage'>> {}
