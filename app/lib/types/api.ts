import { ProductSpec } from '@/app/ui/input/types';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Product Spec API Types
export interface SaveProductSpecRequest {
  productSpec: ProductSpec;
}

export interface SaveProductSpecResponse {
  id: string;
  productSpec: ProductSpec;
  createdAt: string;
  updatedAt: string;
}

// Generic API Error Codes
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

