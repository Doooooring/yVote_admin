type Press = "조선" | "중앙" | "동아" | "한겨레" | "한경" | "매경";

export interface News {
  _id: string;
  order: number;
  title: string;
  summary: string;
  news: Array<{ date: string; title: string; link: string }>;
  journals: Array<{ press: Press; title: string; link: string }>;
  keywords: Array<string>;
  state: boolean;
  opinions: {
    left: string;
    right: string;
  };
  votes: {
    left: number;
    right: number;
    none: number;
  };
}

export interface Preview
  extends Partial<
    Pick<News, "_id" | "order" | "title" | "summary" | "keywords" | "state">
  > {}
