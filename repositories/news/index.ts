import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News, NewsTitle, NewsToPatch, NewsToPost } from '@interface/news';
import axios from 'axios';

class NewsRepositories {
  async getNewsTitles(search: string) {
    const response: {
      data: Response<Array<NewsTitle>>;
    } = await axios.get(`${HOST_URL}/news/titles?search=${search}`);
    return response.data.result;
  }

  async getNewsDetails(id: number) {
    const response: {
      data: Response<NewsToPatch>;
    } = await axios.get(`${HOST_URL}/news/edit/${id}`);
    return response.data.result;
  }

  async postNews(news: NewsToPost) {
    const response: { data: Response<boolean> } = await axios.post(`${HOST_URL}/news/edit`, {
      news: news,
    });
    return response.data.success;
  }

  async patchNews(news: NewsToPatch) {
    const response: { data: Response<boolean> } = await axios.patch(
      `${HOST_URL}/news/edit/${news.id}`,
      {
        news: news,
      },
    );
    return response.data.success;
  }

  async deleteNews(id: number) {
    const response: { data: Response<{ state: boolean }> } = await axios.delete(
      `${HOST_URL}/news/edit/${id}`,
    );
    return response.data.success;
  }
}

export const newsRepositories = new NewsRepositories();
