export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
