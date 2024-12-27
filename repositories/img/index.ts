import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import axios from 'axios';

class ImageRepositories {
  async postImage(img: File, title?: string) {
    const formData = new FormData();
    formData.append('img', img);
    const response: { data: Response<string> } = await axios.post(`${HOST_URL}/img`, formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  }
}

export const imageRepositories = new ImageRepositories();
