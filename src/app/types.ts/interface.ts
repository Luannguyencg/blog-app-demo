
export interface IErrorDetail {
  field: string;
  code: string;
  message: string;
}

export interface IApiErrorResponse {
  type: string;
  status: string;
  path: string;
  message: string;
  error_code: string;
  errors: IErrorDetail[];
}

export interface ILoginPayload {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface ILoginRes {
  data: {
    token: string;
  }
}

interface Avatar {
  url: string;
}

export interface IUser {
  email: string;
  name: string;
  avatar: Avatar;
  admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUserResponse {
  data: IUser;
}

interface Image {
  url: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  comments_count: number;
  image: Image;
  created_at: string;
  updated_at: string;
}

export interface IPaginationResponse {
  count: number;
  page: number;
  offset: number;
  total: number;
  prev: number | null;
  next: number | null;
}

export interface ApiBlogCRRespone {
  data: Blog;
}

export interface ApiBlogRespone {
  data: {
    items: Blog[];
  };
  pagination: IPaginationResponse
}

