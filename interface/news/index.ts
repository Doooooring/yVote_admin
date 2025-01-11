// export enum Press {
//   조선 = '조선',
//   중앙 = '동아',
//   한겨레 = '한겨레',
//   한경 = '한경',
//   매경 = '매경',
//   동아 = '동아',
// }

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

export interface NewsToPost
  extends Pick<
    News,
    | 'title'
    | 'subTitle'
    | 'slug'
    | 'summary'
    | 'state'
    | 'newsImage'
    | 'isPublished'
    | 'comments'
    | 'opinionLeft'
    | 'opinionRight'
  > {
  keywords: {
    id: number;
    keyword: string;
  }[];
  timeline: TimelineToEdit[];
}

export interface NewsToPatch extends NewsToPost {
  id: number;
}

export const initNews = () => {
  const news = {
    title: '',
    subTitle: '',
    slug: '',
    summary: '',
    state: true,
    newsImage: null,
    isPublished: false,
    timeline: [] as Timeline[],
    comments: [] as CommentToEdit[],
    opinionLeft: '',
    opinionRight: '',
    keywords: [] as Array<{ id?: number; keyword: string }>,
  } as NewsToPost;
};
