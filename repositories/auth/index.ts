import { HOST_URL } from '@asset';
import axios from 'axios';
import { AuthPayload, Response } from '../../interface/basic';

class AuthRepositories {
  async checkAuthSession() {
    try {
      const response = await axios.get(`${HOST_URL}/auth/admin/validate-session`, {
        withCredentials: true,
      });

      return response.data.result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getCookieInfo() {
    try {
      const response: { data: Response<AuthPayload> } = await axios.get(
        `${HOST_URL}/auth/admin/cookie-info`,
        {
          withCredentials: true,
        },
      );

      const data = response.data.result;
      if (data) data.expiredAt = new Date(data.expiredAt);
      if (data.expiredAt.getTime() - Date.now() < 0) {
        throw new Error('COOKIE_EXPIRED');
      }

      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async login(code: string) {
    try {
      const response = await axios.post(
        `${HOST_URL}/auth/admin/login`,
        {
          token: code,
        },
        { withCredentials: true },
      );
      return response.data.success;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export const authRepositories = new AuthRepositories();
