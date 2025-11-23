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

// Social Media Types
export interface ImageFormat {
  aspectRatio: string;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  fileTypes: string[];
  label: string;
}

export interface PlatformConfig {
  platform: 'Instagram' | 'LinkedIn';
  postsPerWeek: number;
  imageFormat: ImageFormat;
  postingType: string;
}

export interface SocialMediaInfo {
  platforms: PlatformConfig[];
}

export interface SocialMediaInfoInputProps {
  onSubmit?: (data: SocialMediaInfo) => void;
  onSave?: (data: Partial<SocialMediaInfo>) => void;
  initialData?: Partial<SocialMediaInfo>;
  isLoading?: boolean;
  className?: string;
}

export interface SocialMediaInfoValidationErrors {
  platforms?: string;
}

// Theme Selection Types
export interface Theme {
  id: string;
  title: string;
  description: string;
}

export interface ThemeSelection {
  selectedThemeId: string | null;
}

export interface ThemeSelectionProps {
  themes: Theme[];
  selectedThemeId?: string | null;
  onSelect?: (themeId: string | null) => void;
  onSave?: (data: Partial<ThemeSelection>) => void;
  onRegenerate?: () => void;
  initialData?: Partial<ThemeSelection>;
  isLoading?: boolean;
  className?: string;
  required?: boolean;
}

export interface ThemeSelectionValidationErrors {
  selectedThemeId?: string;
}

// Image Selection Types
export interface ImagePost {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface ImageSelection {
  images: ImagePost[];
}

export interface ImageSelectionProps {
  images: ImagePost[];
  onConfirm?: (images: ImagePost[]) => void;
  onRegenerate?: () => void;
  onSave?: (data: Partial<ImageSelection>) => void;
  initialData?: Partial<ImageSelection>;
  isLoading?: boolean;
  isRegenerating?: boolean;
  className?: string;
}

export interface ImageSelectionValidationErrors {
  images?: string;
}

