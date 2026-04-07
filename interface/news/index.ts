// export enum Press {
//   조선 = '조선',
//   중앙 = '동아',
//   한겨레 = '한겨레',
//   한경 = '한경',
//   매경 = '매경',
//   동아 = '동아',
// }

import { complexClone } from '@/utils';
import { Keyword } from '../keywords';

export enum commentType {
  와이보트 = '와이보트',
  입법부 = '입법부',
  행정부 = '행정부',
  청와대 = '청와대',
  국민의힘 = '국민의힘',
  더불어민주당 = '더불어민주당',
  기타 = '기타',
  헌법재판소 = '헌법재판소',
}

export enum CommentQualification {
  YVOTE = 0,
  YVOTETYPE = 1,
  PUBLIC = 2,
  ETC = 3,
}

export enum NewsType {
  bill = 'bill',
  teukprosecution = 'teukprosecution',
  northkorea = 'northkorea',
  constitution = 'constitution',
  executive = 'executive',
  cabinet = 'cabinet',
  diplomat = 'diplomat',
  govern = 'govern',
  debate = 'debate',
  election = 'election',
  weekly = 'weekly',
  others = 'others',
}

export const newsTypesToKor = (newsType: NewsType) => {
  switch (newsType) {
    case NewsType.bill:
      return '법률';
    case NewsType.constitution:
      return '헌법재판소';
    case NewsType.executive:
      return '시행령';
    case NewsType.cabinet:
      return '국무회의';
    case NewsType.diplomat:
      return '정상외교';
    case NewsType.govern:
      return '행정';
    case NewsType.debate:
      return '논평';
    case NewsType.election:
      return '선거';
    case NewsType.weekly:
      return '일주일';
    case NewsType.teukprosecution:
      return '특검';
    case NewsType.northkorea:
      return '북한';
    case NewsType.others:
      return '기타';
    default:
      // newsType satisfies never;
      return '기타';
  }
};

export interface Comment {
  id: number;
  order: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: string;
  url?: string;
}

export interface CommentToEdit extends Omit<Comment, 'id' | 'date'> {
  id?: number;
  date?: string;
}

export interface CommentsArr {
  type: commentType;
  data: Array<CommentToEdit>;
}

export interface Timeline {
  id: number;
  order: number;
  date: string;
  title: string;
}

export interface TimelineToEdit extends Omit<Timeline, 'id' | 'date'> {
  id?: number;
  date?: string;
  commentType?: commentType;
}

export enum NewsState {
  Published = '0',
  Pending = '1',
  NotPublished = '2',
}

export const NewsStateKor = (state: NewsState) => {
  switch (state) {
    case NewsState.Published:
      return '발행 완료';
    case NewsState.Pending:
      return '발행 중';
    case NewsState.NotPublished:
      return '발행 전';
    default:
      return '?';
  }
};

export interface Article {
  id: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: string;
  newsId: number;
}

export interface NewsSummary {
  id?: number | null;
  summary: string;
  commentType: commentType;
  newsId: number;
}

export interface PartyVote {
  party: string;
  for: number;
  against: number;
  abstain: number;
  absent: number;
}

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  newsType: NewsType;
  slug: string;
  summary: string;
  summaries: Array<NewsSummary>;
  agendaList?: string;
  speechContent?: string;
  proDebate?: string;
  conDebate?: string;
  billAmendment?: string;
  billSummary?: string;
  billDetail?: string;
  billVoteResult?: string;
  billVoteTotal?: number;
  billVoteByParty?: PartyVote[];
  date: string | null;
  keywords: Array<Keyword>;
  newsImage: string | null;
  isPublished: boolean;
  state: NewsState;
  timeline: Array<Timeline>;
  opinionLeft: string;
  opinionRight: string;
  comments: Array<CommentToEdit>;
  votes: {
    left: number;
    right: number;
    none: number;
  };
}

export interface NewsInView extends Omit<News, 'keywords' | 'comments'> {
  keywords: Array<{ id: number; keyword: string }>;
  comments: Array<commentType>;
}

export interface Preview
  extends Pick<
    News,
    'id' | 'order' | 'newsImage' | 'title' | 'newsType' | 'summary' | 'keywords' | 'state'
  > {}

export interface NewsTitle extends Pick<News, 'id' | 'title' | 'subTitle'> {}

export interface NewsOrg
  extends Pick<
    News,
    | 'title'
    | 'subTitle'
    | 'newsType'
    | 'slug'
    | 'summary'
    | 'summaries'
    | 'agendaList'
    | 'speechContent'
    | 'proDebate'
    | 'conDebate'
    | 'billAmendment'
    | 'billSummary'
    | 'billDetail'
    | 'billVoteResult'
    | 'billVoteTotal'
    | 'billVoteByParty'
    | 'date'
    | 'state'
    | 'newsImage'
    | 'isPublished'
    | 'opinionLeft'
    | 'opinionRight'
  > {
  id?: number;
  keywords: {
    id: number;
    keyword: string;
  }[];
  timeline: TimelineToEdit[];
  comments: Array<commentType>;
}

export interface NewsToEdit extends NewsOrg {
  id: number;
}

export interface NewsToPost extends Partial<NewsOrg> {}

export interface NewsToPatch extends Partial<NewsOrg> {
  id: number;
}

export const defaultNews = {
  title: '',
  subTitle: '',
  newsType: NewsType.others,
  slug: '',
  summary: '',
  summaries: [] as Array<NewsSummary>,
  agendaList: '',
  speechContent: '',
  proDebate: '',
  conDebate: '',
  billAmendment: '',
  billSummary: '',
  billDetail: '',
  billVoteResult: '',
  billVoteTotal: 0,
  billVoteByParty: [],
  date: null,
  state: NewsState.NotPublished,
  newsImage: '',
  isPublished: false,
  timeline: [] as TimelineToEdit[],
  comments: [] as Array<commentType>,
  opinionLeft: '',
  opinionRight: '',
  keywords: [] as Array<{ id: number; keyword: string }>,
} as NewsOrg;

export const initNews = () => {
  const news = complexClone(defaultNews) as Omit<NewsOrg, 'id'>;
  return news;
};

export const setDefaultNews = (news: NewsOrg) => {
  const newsOrg = complexClone({ ...defaultNews });
  return { ...newsOrg, ...news } as NewsOrg;
};
