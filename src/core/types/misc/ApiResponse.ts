import { ResponseResultArray, ResponseResultIronlake } from "./ResponseResult";

export type ApiResponse<T> = {
  result: ResponseResultArray<T>;
  title: string;
  statusCode: number;
  total: number;
};

export type ApiResponseIronlake<ContentT> = {
  title: string;
  statusCode: number;
  result: ResponseResultIronlake<ContentT>;
};

export type ApiResponseIronForms<T> = {
  title: string;
  statusCode: number;
  result: T;
};

export type ApiResponseTotal<T> = {
  result: any,
  title: string
  statusCode: number
  total: number
};
