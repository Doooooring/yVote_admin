import { HOST_URL } from '@asset';
import { Response } from '@interface/basic';
import axios from 'axios';

class AuthRepositories {
  async checkAuthSession() {
    try {
      const response: Response<boolean> = await axios.get(
        `${HOST_URL}/auth/admin/validate-session`,
      );
      return response.data.result;
    } catch (e) {
      return false;
    }
  }

  async login(code: string) {
    try {
      const response = await axios.post(`${HOST_URL}/auth/admin/login`, {
        code,
      });
      return response.data.result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export const authRepositories = new AuthRepositories();
