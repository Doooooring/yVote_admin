import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News } from '@interface/news';
import axios from 'axios';

interface NewsTitle extends Partial<Pick<News, '_id' | 'order' | 'title'>> {}

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
}

export const newsRepositories = new NewsRepositories();
