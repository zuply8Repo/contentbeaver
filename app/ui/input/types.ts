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
  // Called whenever the full, current form data changes
  onDataChange?: (data: CompanyInfo) => void;
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
  // Called whenever the full, current form data changes
  onDataChange?: (data: BrandingInfo) => void;
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
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface ImageUploadProps {
  onSubmit?: (image: ImageFile | null) => void;
  onSave?: (image: ImageFile | null) => void;
  onChange?: (image: ImageFile | null) => void;
  initialImage?: ImageFile | null;
  maxSize?: number;
  acceptedFormats?: string[];
  isLoading?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export interface ImageUploadValidationErrors {
  image?: string;
  fileType?: string;
  fileSize?: string;
}

// Theme Selection Types
export interface ThemeOption {
  id: string;
  text: string;
  columnName: string; // "theme1", "theme2", or "theme3"
}

export interface ThemeData {
  id: string;
  created_at: string;
  theme1: string;
  theme2: string;
  theme3: string;
  selected_theme: string | null;
}

export interface ThemeSelectorProps {
  onSubmit?: (selectedTheme: string, themeData: ThemeOption) => void;
  onThemeSelect?: (theme: ThemeOption) => void;
  initialSelection?: string | null;
  isLoading?: boolean;
  className?: string;
}

