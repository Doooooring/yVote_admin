import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { Comment, commentType, NewsOrg, NewsTitle, NewsToPatch, NewsToPost } from '@interface/news';
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
      data: Response<NewsOrg>;
    } = await axios.get(`${HOST_URL}/news/edit/${id}`);
    return response.data.result;
  }

  async getNewsComment(id: number, type: commentType, page: number, limit: number = 20) {
    const response: { data: Response<Comment[]> } = await axios.get(
      `${HOST_URL}/news/${id}/comment?type=${type}&offset=${page}&limit=${limit}`,
    );
    return response.data.result;
  }

  async postNews(news: NewsToPost) {
    const response: { data: Response<number> } = await axios.post(
      `${HOST_URL}/news/edit`,
      {
        news: news,
      },
      {
        withCredentials: true,
      },
    );
    return response.data.result;
  }

  async patchNews(news: NewsToPatch) {
    const response: { data: Response<boolean> } = await axios.patch(
      `${HOST_URL}/news/edit/${news.id}`,
      {
        news: news,
      },
      {
        withCredentials: true,
      },
    );
    return response.data.success;
  }

  async deleteNews(id: number) {
    const response: { data: Response<{ state: boolean }> } = await axios.delete(
      `${HOST_URL}/news/edit/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data.success;
  }
}

export const newsRepositories = new NewsRepositories();
