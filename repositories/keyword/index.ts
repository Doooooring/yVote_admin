import { HOST_URL } from '@/asset';
import { Response } from '@interface/basic';
import { KeywordTitle, KeywordToPatch, KeywordToPost } from '@interface/keywords';
import axios from 'axios';

class KeywordRepositories {
  async getKeyword(keyname: string) {
    const response: { data: Response<KeywordToPatch> } = await axios.get(
      `${HOST_URL}/keyword?key=${keyname}&isWithNews=${true}`,
    );

    return response.data.result;
  }

  async getKeywordTitles(search: string) {
    const response: {
      data: Response<Array<KeywordTitle>>;
    } = await axios.get(`${HOST_URL}/keyword/key-list?search=${search}`);
    return response.data.result;
  }

  async postKeyword(keyword: KeywordToPost) {
    const response: { data: Response<boolean> } = await axios.post(
      `${HOST_URL}/keyword/edit`,
      {
        keyword: keyword,
      },
      {
        withCredentials: true,
      },
    );
    return true;
  }

  async patchKeyword(keyword: KeywordToPatch) {
    const response: { data: Response<{ state: boolean }> } = await axios.patch(
      `${HOST_URL}/keyword/edit/${keyword.id}`,
      { keyword: keyword },
      {
        withCredentials: true,
      },
    );
    return true;
  }
  async deleteKeyword(id: number) {
    const response: { data: Response<{ state: boolean }> } = await axios.delete(
      `${HOST_URL}/keyword/edit/${id}`,
      {
        withCredentials: true,
      },
    );
    return true;
  }
}

export const keywordRepositories = new KeywordRepositories();
