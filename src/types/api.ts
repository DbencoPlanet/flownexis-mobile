// Uniform API Response Interface (Shared architecture)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  } | null;
}
