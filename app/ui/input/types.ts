export interface ProductSpec {
  productName: string;
  description: string;
  features: string[];
  technicalSpecs: string;
  tags: string[];
}

export interface ProductSpecInputProps {
  onSubmit?: (data: ProductSpec) => void;
  onSave?: (data: Partial<ProductSpec>) => void;
  initialData?: Partial<ProductSpec>;
  isLoading?: boolean;
  className?: string;
}

export interface ValidationErrors {
  productName?: string;
  description?: string;
  features?: string;
  technicalSpecs?: string;
  tags?: string;
}

// Company Information Types
export interface CompanyInfo {
  companyName: string;
  industryNiche: string;
  productService: string;
  audience: string;
  mission: string;
  vision: string;
  statements: string[];
}

export interface CompanyInfoInputProps {
  onSubmit?: (data: CompanyInfo) => void;
  onSave?: (data: Partial<CompanyInfo>) => void;
  initialData?: Partial<CompanyInfo>;
  isLoading?: boolean;
  className?: string;
}

export interface CompanyInfoValidationErrors {
  companyName?: string;
  industryNiche?: string;
  productService?: string;
  audience?: string;
  mission?: string;
  vision?: string;
  statements?: string;
}

// Branding Types
export interface BrandingInfo {
  colorPalette: ColorInfo[];
  mood: string[];
}

export interface ColorInfo {
  id: string;
  hex: string;
  name: string;
}

export interface BrandingInfoInputProps {
  onSubmit?: (data: BrandingInfo) => void;
  onSave?: (data: Partial<BrandingInfo>) => void;
  initialData?: Partial<BrandingInfo>;
  isLoading?: boolean;
  className?: string;
}

export interface BrandingInfoValidationErrors {
  colorPalette?: string;
  mood?: string;
}

// Image Upload Types
export interface ImageFile {
  id: string; // Unique identifier
  file: File; // Original file object
  preview: string; // Data URL for preview
  name: string;
  size: number;
  type: string;
}

export interface ImageUploadProps {
  // Callbacks
  onSubmit?: (image: ImageFile | null) => void;
  onSave?: (image: Partial<ImageFile> | null) => void;
  onChange?: (image: ImageFile | null) => void;
  
  // Initial state
  initialImage?: ImageFile | null;
  
  // Configuration
  maxSize?: number; // In bytes, default: 5MB
  acceptedFormats?: string[]; // Default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  // UI
  isLoading?: boolean;
  className?: string;
  label?: string; // Default: "Upload Image"
  required?: boolean;
}

export interface ImageUploadValidationErrors {
  image?: string;
  fileType?: string;
  fileSize?: string;
}

