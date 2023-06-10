import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { Keyword } from '@interface/keywords';
import axios from 'axios';

interface keywordToPatch
  extends Partial<Pick<Keyword, '_id' | 'keyword' | 'category' | 'explain' | 'news'>> {}

interface keywordToPost
  extends Partial<Pick<Keyword, 'keyword' | 'category' | 'explain' | 'news'>> {}
export interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

class KeywordRepositories {
  async getKeyword(keyname: string) {
    const response: { data: Response<{ keyword: Keyword }> } = await axios.get(
      `${HOST_URL}/admin/keyword/keyname?keyname=${keyname}`,
    );
    return response.data.result.keyword;
  }

  async getKeywordTitles(search: string) {
    try {
      const response: {
        data: Response<{
          keywordList: Array<KeywordTitle>;
        }>;
      } = await axios.get(`${HOST_URL}/admin/keyword/titles?search=${search}`);
      return response.data.result.keywordList;
    } catch {
      return [];
    }
  }

  getKeywords() {}

  async postKeyword(keyword: keywordToPost) {
    const response: { data: Response<{ state: boolean }> } = await axios.post(
      `${HOST_URL}/admin/keyword`,
      { keyword: keyword },
    );
    return true;
  }

  async patchKeyword(keyword: keywordToPatch) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.patch(
        `${HOST_URL}/admin/keyword`,
        { keyword: keyword },
      );
      return true;
    } catch {
      return false;
    }
  }
  async deleteKeyword(id: string) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.delete(
        `${HOST_URL}/admin/keyword?id=${id}`,
      );
      if (!response) Error;
      else {
        return true;
      }
    } catch {
      return false;
    }
  }
}

export const keywordRepositories = new KeywordRepositories();
