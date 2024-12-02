import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { Keyword } from '@interface/keywords';
import axios from 'axios';

interface keywordToPatch
  extends Partial<Pick<Keyword, 'id' | 'keyword' | 'category' | 'explain' | 'news'>> {}

interface keywordToPost
  extends Partial<Pick<Keyword, 'keyword' | 'category' | 'explain' | 'news'>> {}
export interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

class KeywordRepositories {
  async getKeyword(keyname: string) {
    const response: { data: Response<{ keyword: Keyword }> } = await axios.get(
      `${HOST_URL}/admin/keywords/${keyname}`,
    );
    console.log(response);
    return response.data.result.keyword;
  }

  async getKeywordTitles(search: string) {
    try {
      const response: {
        data: Response<{
          keywords: Array<KeywordTitle>;
        }>;
      } = await axios.get(`${HOST_URL}/admin/keywords/keyword?search=${search}`);
      return response.data.result.keywords;
    } catch {
      return [];
    }
  }

  getKeywords() {}

  async postKeyword(keyword: keywordToPost) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.post(
        `${HOST_URL}/admin/keywords`,
        { keyword: keyword },
      );
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async postImage(id: string, img: File) {
    try {
      const formData = new FormData();
      formData.append('img', img);

      const response = await axios.post(`${HOST_URL}/admin/keywords/img/${id}`, formData, {
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

  async patchKeyword(keyword: keywordToPatch) {
    try {
      const response: { data: Response<{ state: boolean }> } = await axios.patch(
        `${HOST_URL}/admin/keywords`,
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
        `${HOST_URL}/admin/keywords?id=${id}`,
      );
      if (!response) Error;
      else {
        return true;
      }
    } catch {
      return false;
    }
  }

  async deleteKeywordAll() {
    const response: { data: Response<{ state: boolean }> } = await axios.delete(
      `${HOST_URL}/admin/keywords/kmj123/deleteAll`,
    );
  }
}

export const keywordRepositories = new KeywordRepositories();
