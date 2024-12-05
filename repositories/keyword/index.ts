import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import { Keyword, KeywordTitle, keywordToPatch, keywordToPost } from '@interface/keywords';
import axios from 'axios';

class KeywordRepositories {
  async getKeyword(keyname: string) {
    const response: { data: Response<keywordToPatch> } = await axios.get(
      `${HOST_URL}/keyword?key=${keyname}`,
    );

    return response.data.result;
  }

  async getKeywordTitles(search: string) {
    const response: {
      data: Response<Array<KeywordTitle>>;
    } = await axios.get(`${HOST_URL}/keyword/key-list?search=${search}`);
    return response.data.result;
  }

  async postKeyword(keyword: keywordToPost) {
    const response: { data: Response<boolean> } = await axios.post(`${HOST_URL}/keyword/edit`, {
      keyword: keyword,
    });
    return true;
  }

  async patchKeyword(keyword: keywordToPatch) {
    const response: { data: Response<{ state: boolean }> } = await axios.patch(
      `${HOST_URL}/keyword/edit/${keyword.id}`,
      { keyword: keyword },
    );
    return true;
  }
  async deleteKeyword(id: string) {
    const response: { data: Response<{ state: boolean }> } = await axios.delete(
      `${HOST_URL}/keyword/${id}`,
    );
    return true;
  }
}

export const keywordRepositories = new KeywordRepositories();
