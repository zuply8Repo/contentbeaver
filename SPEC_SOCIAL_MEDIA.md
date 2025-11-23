# Specification: Social Media Configuration Page

## Overview
Create a new social media configuration page that allows users to define their social media posting criteria, including platform selection, posting frequency, and image format requirements.

## Requirements

### 1. Page Location
- **Path**: `app/test/social-media/page.tsx`
- **Component**: `app/ui/input/social-media-input.tsx`
- **Types**: Add to `app/ui/input/types.ts`

### 2. Data Structure

#### SocialMediaInfo Interface
```typescript
export interface SocialMediaInfo {
  platforms: PlatformConfig[];
  defaultPostsPerWeek: number;
}

export interface PlatformConfig {
  platform: 'Instagram' | 'LinkedIn';
  postsPerWeek: number;
  imageFormat: ImageFormat;
}

export interface ImageFormat {
  aspectRatio: string;  // e.g., "1:1", "16:9", "4:5"
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  fileTypes: string[];  // e.g., ["JPG", "PNG"]
}
```

### 3. User Interface Requirements

#### Platform Selection
- Allow users to select multiple platforms (Instagram and LinkedIn)
- Each platform should have its own configuration section
- Users can add/remove platforms dynamically
- Minimum 1 platform required

#### Posts Per Week
- Number input field for each platform
- Range: 1-50 posts per week
- Default: 3 posts per week
- Validation: Must be a positive integer

#### Image Format Configuration
- For each platform, display image format requirements:
  - **Instagram**: 
    - Square (1:1): 1080x1080px (min), JPG/PNG
    - Portrait (4:5): 1080x1350px (min), JPG/PNG
    - Landscape (16:9): 1080x608px (min), JPG/PNG
  - **LinkedIn**:
    - Square (1:1): 1200x1200px (min), JPG/PNG
    - Landscape (16:9): 1200x675px (min), JPG/PNG
- Allow users to select preferred format for each platform
- Display format details (dimensions, file types)

### 4. Component Features

#### SocialMediaInput Component
- Form validation with real-time feedback
- Auto-save functionality (1 second debounce)
- Character/input counters where applicable
- Dark mode support
- Responsive design
- Loading states
- Success/error messages
- Reset functionality

#### Form Fields
1. **Platform Selection Section**
   - Checkbox or toggle for Instagram
   - Checkbox or toggle for LinkedIn
   - "Add Platform" button (if more platforms needed in future)
   - Remove platform option for each selected platform

2. **Platform Configuration Cards** (one per selected platform)
   - Platform name header
   - Posts per week input
   - Image format selector (dropdown or radio buttons)
   - Format details display (read-only, shows dimensions and file types)

3. **Default Posts Per Week** (optional, for overall default)
   - Number input
   - Used as default when adding new platforms

### 5. Validation Rules

- At least one platform must be selected
- Posts per week must be between 1 and 50
- All selected platforms must have valid configuration
- Image format must be selected for each platform

### 6. API Integration

#### API Route
- **Path**: `app/api/social-media/route.ts`
- **Method**: POST
- **Request Body**:
```typescript
{
  socialMediaInfo: SocialMediaInfo
}
```

#### Response
- Follow existing API response pattern
- Return `SaveSocialMediaInfoResponse` with id, data, createdAt, updatedAt

#### Database Module
- **Path**: `app/lib/database/social-media-info.ts`
- Functions: `saveSocialMediaInfo()`, `getAllSocialMediaInfo()`
- Use mock database pattern (in-memory storage) like other modules

### 7. Test Page Features

The test page (`app/test/social-media/page.tsx`) should include:
- Dark mode toggle
- Sample data pre-fill
- Form submission handling
- API response display
- Error handling display
- Success message display
- Submitted data preview

### 8. Styling & UX

- Follow existing design patterns from other input components
- Use Tailwind CSS classes consistent with the codebase
- Smooth animations and transitions
- Accessible form controls (ARIA labels, error announcements)
- Visual feedback for all interactions

### 9. Type Definitions

Add to `app/ui/input/types.ts`:
- `SocialMediaInfo`
- `PlatformConfig`
- `ImageFormat`
- `SocialMediaInfoInputProps`
- `SocialMediaInfoValidationErrors`

Add to `app/lib/types/api.ts`:
- `SaveSocialMediaInfoRequest`
- `SaveSocialMediaInfoResponse`

### 10. Platform-Specific Image Format Data

#### Instagram Formats
```typescript
const INSTAGRAM_FORMATS = [
  {
    aspectRatio: "1:1",
    minWidth: 1080,
    minHeight: 1080,
    maxWidth: 1080,
    maxHeight: 1080,
    fileTypes: ["JPG", "PNG"],
    label: "Square (1:1) - 1080x1080px"
  },
  {
    aspectRatio: "4:5",
    minWidth: 1080,
    minHeight: 1350,
    maxWidth: 1080,
    maxHeight: 1350,
    fileTypes: ["JPG", "PNG"],
    label: "Portrait (4:5) - 1080x1350px"
  },
  {
    aspectRatio: "16:9",
    minWidth: 1080,
    minHeight: 608,
    maxWidth: 1080,
    maxHeight: 608,
    fileTypes: ["JPG", "PNG"],
    label: "Landscape (16:9) - 1080x608px"
  }
];
```

#### LinkedIn Formats
```typescript
const LINKEDIN_FORMATS = [
  {
    aspectRatio: "1:1",
    minWidth: 1200,
    minHeight: 1200,
    maxWidth: 1200,
    maxHeight: 1200,
    fileTypes: ["JPG", "PNG"],
    label: "Square (1:1) - 1200x1200px"
  },
  {
    aspectRatio: "16:9",
    minWidth: 1200,
    minHeight: 675,
    maxWidth: 1200,
    maxHeight: 675,
    fileTypes: ["JPG", "PNG"],
    label: "Landscape (16:9) - 1200x675px"
  }
];
```

## Implementation Checklist

- [ ] Create `SocialMediaInfo` type definitions
- [ ] Create `SocialMediaInput` component
- [ ] Create test page at `app/test/social-media/page.tsx`
- [ ] Create API route at `app/api/social-media/route.ts`
- [ ] Create database module at `app/lib/database/social-media-info.ts`
- [ ] Add API types to `app/lib/types/api.ts`
- [ ] Implement form validation
- [ ] Implement auto-save functionality
- [ ] Add dark mode support
- [ ] Test form submission
- [ ] Test error handling
- [ ] Verify responsive design

## Notes

- This follows the same pattern as existing input components (CompanyInfoInput, BrandingInput, ProductSpecInput)
- The component should be reusable and follow the established prop patterns
- Image format data should be predefined constants based on platform requirements
- Users can configure different posting frequencies and image formats per platform

