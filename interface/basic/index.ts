export interface Response<T> {
  success: boolean;
  result: T;
}

export interface AuthPayload {
  username: string;
  expiredAt: Date;
}
