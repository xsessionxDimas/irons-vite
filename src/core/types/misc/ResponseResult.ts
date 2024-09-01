export type ResponseResult<T> = {
  message: string;
  isError: boolean;
  content: T;
};

export type ResponseResultArray<T> = {
  total: number;
  totalData: number;
  message: string;
  isError: boolean;
  content: T[];
};

export type ResponseResultIronlake<ContentT> = {
  message: string;
  isError: boolean;
  content: ContentT;
};

export type ResponseResultTotal<T> = {
  total: number;
  message: string;
  isError: boolean;
  content: T;
};
