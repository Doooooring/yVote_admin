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
  // Historical lineage names — see yvote_automation party_history.py for
  // cutoff dates. Backfill scrapes for past dates emit these instead of
  // the modern canonical names.
  대통령실 = '대통령실',
  한나라당 = '한나라당',
  새누리당 = '새누리당',
  자유한국당 = '자유한국당',
  미래통합당 = '미래통합당',
  통합민주당 = '통합민주당',
  민주당 = '민주당',
  민주통합당 = '민주통합당',
  새정치민주연합 = '새정치민주연합',
}

// "Alive" commentTypes — the ones an editor reaches for on a current
// (post-2025-12-29) news. Surfaced first in the admin commentType
// dropdown; historical (era-only) types follow after a separator.
export const CURRENT_COMMENT_TYPES: ReadonlyArray<commentType> = [
  commentType.와이보트,
  commentType.입법부,
  commentType.행정부,
  commentType.청와대,
  commentType.국민의힘,
  commentType.더불어민주당,
  commentType.헌법재판소,
  commentType.기타,
];

export const HISTORICAL_COMMENT_TYPES: ReadonlyArray<commentType> = [
  // 청와대 lineage
  commentType.대통령실,
  // Conservative lineage (oldest → newest)
  commentType.한나라당,
  commentType.새누리당,
  commentType.자유한국당,
  commentType.미래통합당,
  // Progressive lineage (oldest → newest)
  commentType.통합민주당,
  commentType.민주당,
  commentType.민주통합당,
  commentType.새정치민주연합,
];

export enum CommentQualification {
  YVOTE = 0,
  YVOTETYPE = 1,
  PUBLIC = 2,
  ETC = 3,
}

export enum NewsType {
  bill = 'bill',
  specialcounsel = 'specialcounsel',
  northkorea = 'northkorea',
  constitution = 'constitution',
  executive = 'executive',
  cabinet = 'cabinet',
  diplomat = 'diplomat',
  govern = 'govern',
  debate = 'debate',
  election = 'election',
  weekly = 'weekly',
  investigation = 'investigation',
  budget = 'budget',
  plenary = 'plenary',
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
    case NewsType.specialcounsel:
      return '특검';
    case NewsType.northkorea:
      return '북한';
    case NewsType.investigation:
      return '국정조사';
    case NewsType.budget:
      return '예산';
    case NewsType.plenary:
      return '본회의';
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

export interface BillItem {
  billNo: string;
  billName: string;
  detail?: string;
  proposalReason?: string;
  voteResult?: string;
  voteTotal?: number;
  voteByParty?: PartyVote[];
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
  bills?: BillItem[];
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
    | 'bills'
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
  bills: [],
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
