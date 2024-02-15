export enum commentType {
  // 전략가 = '전략가',
  // 지도자 = '지도자',
  // 예술가 = '예술가',
  // 감시자 = '감시자',
  // 운영자 = '운영자',
  // 공화주의자 = '공화주의자',
  // 관찰자 = '관찰자',
  // 개혁가 = '개혁가',
  // 이론가 = '이론가',
  // 자유주의자 = '자유주의자',
  와이보트 = '와이보트',
  행정부 = '행정부',
  청와대 = '청와대',
  국민의힘 = '국민의힘',
  민주당 = '민주당',
  기타 = '기타',
  헌법재판소 = '헌법재판소',
}

export interface Timeline {
  date: string;
  title: string;
}
export interface News {
  _id: string;
  order: number;
  title: string;
  summary: string;
  keywords: Array<string>;
  state: boolean;
  timeline: Array<Timeline>;
  opinions: {
    left: string;
    right: string;
  };
  comments: {
    [key in commentType]?: Array<{
      title: string;
      comment: string;
    }>;
  };
  votes: {
    left: number;
    right: number;
    none: number;
  };
}

export interface Preview
  extends Partial<Pick<News, '_id' | 'order' | 'title' | 'summary' | 'keywords' | 'state'>> {}
