# Image Upload Component Specification

**Timestamp:** 2025-11-22T16:05 UTC  
**Author:** Spec Engineer Agent  
**Status:** Draft - Awaiting Approval

## Overview

Create a reusable image upload component that allows users to upload, preview, and manage images. The component should follow the existing design patterns in the codebase and integrate seamlessly with the current UI system.

## Requirements

### Functional Requirements

1. **Image Upload**
   - Support drag-and-drop file upload
   - Support click-to-browse file selection
   - Accept common image formats: JPEG, PNG, GIF, WebP
   - Validate file type before upload
   - Validate file size (configurable, default: 5MB max)
   - Support single or multiple image uploads (configurable)

2. **Image Preview**
   - Display thumbnail preview of uploaded images
   - Show image name and size
   - Allow removal of individual images
   - Support image replacement

3. **Validation & Error Handling**
   - File type validation with clear error messages
   - File size validation with clear error messages
   - Display validation errors inline
   - Prevent invalid files from being added

4. **State Management**
   - Track uploaded images in component state
   - Support initial images (for edit scenarios)
   - Auto-save functionality (optional, similar to other input components)
   - Callback on image change (onChange)
   - Callback on image submit (onSubmit)

### Non-Functional Requirements

1. **Design Consistency**
   - Match existing component styling (zinc color scheme, dark mode support)
   - Use Tailwind CSS classes consistent with other input components
   - Follow the same border, focus, and transition patterns
   - Match spacing and typography

2. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader friendly
   - Focus indicators

3. **Responsive Design**
   - Mobile-friendly drag-and-drop area
   - Responsive image grid for multiple images
   - Touch-friendly controls

4. **Performance**
   - Client-side image preview (no server round-trip for preview)
   - Efficient file handling
   - Optional image compression/resizing before upload

## Component Interface

### Props

```typescript
interface ImageUploadProps {
  // Callbacks
  onSubmit?: (images: ImageFile[]) => void;
  onSave?: (images: Partial<ImageFile[]>) => void;
  onChange?: (images: ImageFile[]) => void;
  
  // Initial state
  initialImages?: ImageFile[];
  
  // Configuration
  multiple?: boolean; // Default: false
  maxSize?: number; // In bytes, default: 5MB
  acceptedFormats?: string[]; // Default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  maxImages?: number; // For multiple mode, default: 10
  
  // UI
  isLoading?: boolean;
  className?: string;
  label?: string; // Default: "Upload Image"
  required?: boolean;
}

interface ImageFile {
  id: string; // Unique identifier
  file: File; // Original file object
  preview: string; // Data URL for preview
  name: string;
  size: number;
  type: string;
}
```

### Validation Errors

```typescript
interface ImageUploadValidationErrors {
  images?: string;
  fileType?: string;
  fileSize?: string;
  maxImages?: string;
}
```

## Technical Specifications

### File Structure

```
app/ui/input/
  ├── image-upload.tsx       # Main component
  └── types.ts               # Add ImageUploadProps and ImageFile types
```

### Implementation Details

1. **File Handling**
   - Use HTML5 File API
   - Create preview using `FileReader` API
   - Store File objects in state for actual upload

2. **Drag and Drop**
   - Use native HTML5 drag-and-drop events
   - Visual feedback during drag-over state
   - Prevent default browser behavior

3. **Image Preview**
   - Generate data URLs for preview
   - Display thumbnails in a grid layout
   - Show loading state during preview generation

4. **Styling**
   - Use existing Tailwind classes
   - Match color scheme: zinc-50/zinc-950 background, indigo accents
   - Use same border and focus ring patterns as other inputs
   - Support dark mode with dark: variants

## Acceptance Criteria

1. ✅ User can drag and drop an image file onto the upload area
2. ✅ User can click to browse and select an image file
3. ✅ Image preview appears immediately after selection
4. ✅ Invalid file types are rejected with clear error message
5. ✅ Files exceeding max size are rejected with clear error message
6. ✅ User can remove uploaded images
7. ✅ Component supports both single and multiple image modes
8. ✅ Component matches existing design system
9. ✅ Component is fully accessible (keyboard navigation, screen readers)
10. ✅ Component works on mobile devices
11. ✅ Dark mode is fully supported
12. ✅ Validation errors display inline
13. ✅ Component calls onChange callback when images change
14. ✅ Component calls onSubmit callback when form is submitted
15. ✅ Component supports initial images for edit scenarios

## Dependencies

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript 5

## Future Enhancements (Out of Scope)

- Image cropping/editing
- Image compression before upload
- Progress indicator for actual upload
- Integration with cloud storage (S3, Cloudinary, etc.)
- Image optimization
- Batch upload with progress tracking

## Notes

- This component focuses on client-side file handling and preview
- Actual file upload to server should be handled by parent component or API route
- Component follows the same pattern as ProductSpecInput, CompanyInfoInput, and BrandingInput components
- No external image upload libraries required for basic functionality

