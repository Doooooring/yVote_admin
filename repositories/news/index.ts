import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News } from '@interface/news';
import axios from 'axios';

export interface NewsTitle extends Partial<Pick<News, '_id' | 'order' | 'title'>> {}

export interface NewsToPost
  extends Partial<
    Pick<News, 'news' | 'summary' | 'title' | 'state' | 'opinions' | 'keywords' | 'journals'>
  > {}
export interface NewsToPatch extends NewsToPost {
  _id: string;
}
class NewsRepositories {
  async getNewsTitles(search: string) {
    console.log('is get news');
    try {
      const response: {
        data: Response<{
          newsList: Array<NewsTitle>;
        }>;
      } = await axios.get(`${HOST_URL}/admin/news/newstitle?search=${search}`);
      console.log(response.data.result.newsList);
      return response.data.result.newsList;
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
      } = await axios.get(`${HOST_URL}/admin/news/id?id=${id}`);
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
      } = await axios.get(`${HOST_URL}/admin/news/newstitle`);
    } catch {}
  }

  async postNews(news: NewsToPost) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.post(
        `${HOST_URL}/admin/news`,
        {
          news: news,
        },
      );
      console.log(response);
      return true;
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
      console.log(response);
      return true;
    } catch {
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
}

export const newsRepositories = new NewsRepositories();
