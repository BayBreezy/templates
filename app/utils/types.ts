export type User = typeof authClient.$Infer.Session;

export type ApiResponseMeta = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};
export type FindOne<T> = {
  data: T;
  meta?: ApiResponseMeta;
};
export type FindMany<T> = {
  data: T[];
  meta: ApiResponseMeta;
};

export type Project = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  userId?: string;
  user?: User["user"];
};

export type Template = {
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name: string;
  html?: string;
  design?: any;
  project?: Project;
  projectId?: string;
};

export type PaginateParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: Record<string, "asc" | "desc">;
  projectId?: string;
};
