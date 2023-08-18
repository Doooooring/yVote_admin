import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News } from '@interface/news';
import axios from 'axios';

export interface NewsTitle extends Partial<Pick<News, '_id' | 'order' | 'title'>> {}

export interface NewsToPost
  extends Pick<
    News,
    'title' | 'summary' | 'keywords' | 'state' | 'timeline' | 'comments' | 'opinions'
  > {}
export interface NewsToPatch extends NewsToPost {
  _id: string;
}
class NewsRepositories {
  async getNewsTitles(search: string) {
    try {
      const response: {
        data: Response<{
          news: Array<NewsTitle>;
        }>;
      } = await axios.get(`${HOST_URL}/admin/news/title?search=${search}`);
      return response.data.result.news;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getNewsDetails(id: string) {
    try {
      const response: {
        data: Response<{
          news: NewsToPatch;
        }>;
      } = await axios.get(`${HOST_URL}/admin/news/${id}`);
      return response.data.result.news;
    } catch {
      return false;
    }
  }

  async getNewsLists(search: string) {
    try {
      const response: {
        data: Response<{
          news: News;
        }>;
      } = await axios.get(`${HOST_URL}/admin/news/title?search=${search}`);
      return response.data.result.news;
    } catch {}
  }

  async postNews(news: NewsToPost) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.post(
        `${HOST_URL}/admin/news`,
        // {
        //   title: '테스트 데이터 제목입니다.',
        //   summary:
        //     '더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.$ 더미데이터 내용입니다. 더미데이터 내용입니다. 더미데이터 내용입니다.',
        //   keywords: [],
        //   state: true,
        //   timeline: [
        //     {
        //       date: '2017.08.12',
        //       title: '더미데이터 입니다.',
        //     },
        //     {
        //       date: '2017.08.12',
        //       title: '더미데이터 입니다.',
        //     },
        //     {
        //       date: '2017.08.12',
        //       title: '더미데이터 입니다.',
        //     },
        //   ],
        //   opinions: {
        //     left: '왼쪽 의견 입니다.',
        //     right: '오른쪽 의견입니다.',
        //   },
        //   comments: {
        //     전략가: [
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //     ],
        //     개혁가: [
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //     ],
        //     관찰자: [
        //       {
        //         title: 'test1',
        //         comment: 'test1 comment',
        //       },
        //     ],
        //   },
        // },
        {
          news: news,
        },
      );
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async patchNews(news: NewsToPatch) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.patch(
        `${HOST_URL}/admin/news`,
        {
          news: news,
        },
      );
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async postImage(id: string, img: File) {
    try {
      const formData = new FormData();
      formData.append('img', img);

      const response = await axios.post(`${HOST_URL}/admin/news/img/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.success;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteNews(id: string) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.delete(
        `${HOST_URL}/admin/news?id=${id}`,
      );

      if (!response.data.result.state) Error;
      else {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  async deleteNewsAll() {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.delete(
        `${HOST_URL}/admin/news/kmj123/deleteAll`,
      );
      if (!response.data.result.state) Error;
      else {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
}

export const newsRepositories = new NewsRepositories();
