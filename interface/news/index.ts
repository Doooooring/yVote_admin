// export enum Press {
//   조선 = '조선',
//   중앙 = '동아',
//   한겨레 = '한겨레',
//   한경 = '한경',
//   매경 = '매경',
//   동아 = '동아',
// }

import { complexClone } from '@utils';
import { Keyword } from '../keywords';

export enum commentType {
  와이보트 = '와이보트',
  행정부 = '행정부',
  대통령실 = '대통령실',
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

export interface Comment {
  id: number;
  order: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: Date;
  url?: string;
}

export interface CommentToEdit extends Omit<Comment, 'id' | 'date'> {
  id?: number;
  date?: Date;
}

export interface CommentsArr {
  type: commentType;
  data: Array<CommentToEdit>;
}

export interface Timeline {
  id: number;
  date: Date;
  title: string;
}

export interface TimelineToEdit extends Omit<Timeline, 'id' | 'date'> {
  id?: number;
  date?: Date;
}

export interface Article {
  id: number;
  commentType: commentType;
  title: string;
  comment: string;
  date: Date;
  newsId: number;
}

export interface News {
  id: number;
  order: number;
  title: string;
  subTitle: string;
  slug: string;
  summary: string;
  date: Date | null;
  keywords: Array<Keyword>;
  newsImage: string | null;
  isPublished: boolean;
  state: boolean;
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

export interface NewsInView extends Omit<News, 'keywords' | 'comments' | ''> {
  keywords: Array<{ id: number; keyword: string }>;
  comments: Array<commentType>;
}

export interface Preview
  extends Pick<News, 'id' | 'order' | 'newsImage' | 'title' | 'summary' | 'keywords' | 'state'> {}

export interface NewsTitle extends Pick<News, 'id' | 'title'> {}

export interface NewsOrg
  extends Pick<
    News,
    | 'title'
    | 'subTitle'
    | 'slug'
    | 'summary'
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
  slug: '',
  summary: '',
  date: null,
  state: true,
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
