import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { Keyword } from '@interface/keywords';
import axios from 'axios';

interface keywordToSend
  extends Partial<Pick<Keyword, 'keyword' | 'category' | 'explain' | 'news'>> {}

class KeywordReposiotires {
  async getKeyword(keyname: string) {
    const response: Response<{ keyword: Keyword }> = await axios.get(
      `${HOST_URL}/admin/keyword?keyname=${keyname}`,
    );
    return response.result.keyword;
  }

  getKeywords() {}

  postKeyword(keyword: keywordToSend) {}

  patchNews(keyword: keywordToSend) {}
}
