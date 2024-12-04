import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News } from '@interface/news';
import axios from 'axios';

export interface NewsTitle extends Partial<Pick<News, 'id' | 'title'>> {}

export interface NewsToPost
  extends Pick<
    News,
    | 'title'
    | 'summary'
    | 'keywords'
    | 'state'
    | 'isPublished'
    | 'timeline'
    | 'comments'
    | 'opinionLeft'
    | 'opinionRight'
  > {}

export interface NewsToPatch extends NewsToPost {
  id: number;
}

class NewsRepositories {
  async getNewsTitles(search: string) {
    const response: {
      data: Response<Array<NewsTitle>>;
    } = await axios.get(`${HOST_URL}/news/titles?search=${search}`);
    return response.data.result;
  }

  async getNewsDetails(id: string) {
    const response: {
      data: Response<NewsToPatch>;
    } = await axios.get(`${HOST_URL}/news/edit/${id}`);
    return response.data.result;
  }

  async postNews(news: NewsToPost) {
    const response: { data: Response<{ state: boolean }> } = await axios.post(
      `${HOST_URL}/news/edit`,
      {
        news: news,
      },
    );
    return response.data.success;
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
