# Specification: Image Selection Component

## Overview
Create a new image selection component that allows users to review and confirm three images for social media posting. Each image is displayed with its associated caption. Users can confirm the images or regenerate them (keeping captions unchanged).

## Requirements

### 1. Component Location
- **Component**: `app/ui/input/image-selection.tsx`
- **Test Page**: `app/test/image-selection/page.tsx`
- **Types**: Add to `app/ui/input/types.ts`

### 2. Data Structure

#### ImagePost Interface
```typescript
export interface ImagePost {
  id: string;
  imageUrl: string;  // URL or base64 data URL for the image
  caption: string;   // The caption that will be posted with the image
}

export interface ImageSelection {
  images: ImagePost[];  // Exactly 3 images
}
```

### 3. User Interface Requirements

#### Image Display
- Display 3 images in a grid or vertical layout
- Each image should be displayed as a card containing:
  - Image preview (with proper aspect ratio handling)
  - Caption text displayed below or next to the image
  - Image should be clickable/expandable for better viewing (optional)
- Images should be responsive and maintain aspect ratio
- Visual feedback for confirmed state

#### Caption Display
- Each caption should be clearly associated with its image
- Caption should be editable or read-only (based on requirements - for now, read-only as per spec)
- Caption text should be visible and readable
- Consider character limits if applicable

#### Actions
- **Confirm Images**: Button to confirm/accept the current set of images
- **Regenerate Images**: Button to generate new images while keeping captions unchanged
- When regenerating, only images change, captions remain the same

### 4. Component Features

#### ImageSelectionInput Component
- Display 3 images with their captions
- Confirm action to accept images
- Regenerate action to get new images (captions preserved)
- Auto-save functionality (1 second debounce)
- Dark mode support
- Responsive design
- Loading states during regeneration
- Success/error messages

#### Props Interface
```typescript
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
```

### 5. Sample Data

For the test page, use sample images and captions:

```typescript
const SAMPLE_IMAGES: ImagePost[] = [
  {
    id: "1",
    imageUrl: "https://via.placeholder.com/1080x1080/6366F1/FFFFFF?text=Image+1",
    caption: "🎄 Celebrate the holiday season with our special collection! Limited time offers on festive favorites. #HolidayShopping #SpecialOffers"
  },
  {
    id: "2",
    imageUrl: "https://via.placeholder.com/1080x1080/8B5CF6/FFFFFF?text=Image+2",
    caption: "✨ Introducing our latest innovation! Experience the future of technology with cutting-edge features designed for you. #NewProduct #Innovation"
  },
  {
    id: "3",
    imageUrl: "https://via.placeholder.com/1080x1080/EC4899/FFFFFF?text=Image+3",
    caption: "🔥 Black Week is here! Don't miss out on exclusive deals and massive savings. Shop now before it's too late! #BlackWeek #Sale"
  }
];
```

**Note**: In production, images would come from an API or image generation service. For testing, use placeholder images or sample URLs.

### 6. Regeneration Behavior

- When user clicks "Regenerate":
  - Only images are regenerated (new image URLs)
  - Captions remain exactly the same
  - Image IDs may change or stay the same (implementation detail)
  - Show loading state during regeneration
  - After regeneration, display new images with same captions

### 7. Validation Rules

- Exactly 3 images must be present
- Each image must have a valid imageUrl
- Each image must have a caption (non-empty string)
- Images should be validated for proper format/URL

### 8. Styling & UX

- Follow existing design patterns from other input components
- Use Tailwind CSS classes consistent with the codebase
- Smooth animations and transitions
- Image hover effects for better UX
- Responsive grid layout (1 column on mobile, 3 columns on desktop)
- Loading skeleton or spinner during regeneration
- Visual confirmation feedback when images are confirmed

### 9. Test Page Features

The test page (`app/test/image-selection/page.tsx`) should include:
- Dark mode toggle
- Sample images with captions pre-configured
- Confirm handling
- Regenerate handling (with mock image regeneration)
- Display of confirmed images
- Instructions panel
- Features list

### 10. Component Structure

```
ImageSelectionInput Component
├── Container
│   ├── Title/Label
│   ├── Images Grid (3 images)
│   │   ├── Image Card 1
│   │   │   ├── Image Preview
│   │   │   └── Caption
│   │   ├── Image Card 2
│   │   │   ├── Image Preview
│   │   │   └── Caption
│   │   └── Image Card 3
│   │       ├── Image Preview
│   │       └── Caption
│   ├── Action Buttons
│   │   ├── Confirm Images
│   │   └── Regenerate Images
│   └── Success/Error Messages
```

### 11. Image Display Details

- Images should maintain aspect ratio
- Use object-fit: cover or contain as appropriate
- Add loading states for images
- Handle image load errors gracefully
- Consider lazy loading for performance
- Image size: Responsive, but maintain good visibility

### 12. Caption Display Details

- Caption should be clearly readable
- Consider text wrapping for long captions
- Show character count if applicable
- Use appropriate font size and color for readability
- Caption should be visually connected to its image

## Implementation Checklist

- [ ] Create `ImagePost` and `ImageSelection` type definitions
- [ ] Create `ImageSelectionInput` component
- [ ] Create test page at `app/test/image-selection/page.tsx`
- [ ] Implement image display with captions
- [ ] Implement confirm functionality
- [ ] Implement regenerate functionality (keep captions)
- [ ] Add loading states
- [ ] Add auto-save functionality
- [ ] Add dark mode support
- [ ] Test image loading and error handling
- [ ] Test responsive design
- [ ] Add accessibility features

## Notes

- Images can be provided as URLs or base64 data URLs
- For testing, use placeholder images or sample image URLs
- In production, images would likely come from an AI image generation service
- Captions are preserved during regeneration - this is a key requirement
- The component should handle image loading errors gracefully
- Consider adding image preview/zoom functionality for better UX

