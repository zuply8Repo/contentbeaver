import { ProductSpec, CompanyInfo, BrandingInfo } from "@/app/ui/input/types";

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

// Company Info API Types
export interface SaveCompanyInfoRequest {
  companyInfo: CompanyInfo;
  // Optional branding fields captured during unified onboarding
  colorPalette?: BrandingInfo["colorPalette"];
  brandMood?: BrandingInfo["mood"];
}

export interface SaveCompanyInfoResponse {
  id: string;
  companyInfo: CompanyInfo;
  createdAt: string;
  updatedAt: string;
}

// Branding Info API Types
export interface SaveBrandingInfoRequest {
  brandingInfo: BrandingInfo;
}

export interface SaveBrandingInfoResponse {
  id: string;
  brandingInfo: BrandingInfo;
  createdAt: string;
  updatedAt: string;
}

// Generic API Error Codes
export enum ApiErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

// Image Upload API Types
export interface UploadImageRequest {
  file: File;
  description: string;
}

export interface UserUpload {
  id: string;
  storage_path: string;
  description: string;
  created_at: string;
}

export interface UploadImageResponse {
  upload: UserUpload;
  public_url: string;
  filename: string;
  original_name: string;
}

export interface GetUploadsResponse {
  uploads: Array<{
    id: string;
    storage_path: string;
    description: string;
    created_at: string;
    public_url: string;
  }>;
}

export interface GetUploadByIdResponse {
  upload: {
    id: string;
    storage_path: string;
    description: string;
    created_at: string;
    public_url: string;
  };
}
