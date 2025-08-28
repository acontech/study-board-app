export interface User {
  id: number;
  email: string;
  nickname: string;
  birth_date: string;
}

export interface Session {
  user: User | null;
  accessToken?: string;
}
