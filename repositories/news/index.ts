import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { News } from '@interface/news';
import axios from 'axios';

interface NewsTitle extends Partial<Pick<News, '_id' | 'order' | 'title'>> {}

class NewsRepositories {
  async getNewsTitles(search: string) {
    const response: Response<{
      newsList: Array<NewsTitle>;
    }> = await axios.get(`${HOST_URL}/admin/news/newstitle/?search=${search}`);
    return response.result.newsList;
  }
}

export const newsRepositories = new NewsRepositories();
