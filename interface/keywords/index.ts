export enum category {
  'human' = 'human',
  'politics' = 'politics',
  'policy' = 'policy',
  'economics' = 'economics',
  'social' = 'social',
  'organization' = 'organization',
  'etc' = 'etc',
}

export interface Keyword {
  _id: string;
  keyword: string;
  explain: string;
  category: category;
  recent: boolean;
  news: Array<number>; //number : news order
}

export interface KeywordToView
  extends Partial<Pick<Keyword, '_id' | 'keyword' | 'category' | 'recent'>> {}

export interface KeywordOnDetail extends Partial<Pick<Keyword, '_id' | 'keyword' | 'explain'>> {}

export interface KeywordInHuman extends KeywordToView {
  category: category.human;
}
export interface KeywordInPolitics extends KeywordToView {
  category: category.politics;
}
export interface KeywordInPolicy extends KeywordToView {
  category: category.policy;
}
export interface KeywordInEconomy extends KeywordToView {
  category: category.economics;
}
export interface KeywordInSocial extends KeywordToView {
  category: category.social;
}
export interface KeywordInOrganization extends KeywordToView {
  category: category.organization;
}
export interface KeywordInEtc extends KeywordToView {
  category: category.etc;
}
