# Specification: Theme Selection Component

## Overview
Create a new theme selection component that allows users to select one theme from three available options for social media posting. Each theme is displayed with a title and description, and selection is done via checkboxes (single selection behavior). Themes represent different posting campaigns or seasonal events like Christmas, New Product Launch, or Black Week.

## Requirements

### 1. Component Location
- **Component**: `app/ui/input/theme-selection.tsx`
- **Test Page**: `app/test/theme-selection/page.tsx`
- **Types**: Add to `app/ui/input/types.ts`

### 2. Data Structure

#### Theme Interface
```typescript
export interface Theme {
  id: string;
  title: string;
  description: string;
}

export interface ThemeSelection {
  selectedThemeId: string | null;
}
```

### 3. User Interface Requirements

#### Theme Display
- Display 3 themes in a vertical or grid layout
- Each theme should be displayed as a card/box with:
  - Checkbox for selection
  - Theme title (prominent)
  - Theme description (short text)
- Only one theme can be selected at a time (checkbox behavior but single selection)
- Visual feedback when a theme is selected (border highlight, background change)
- Hover effects for better UX

#### Selection Behavior
- When a user clicks a checkbox:
  - If clicking an unselected theme, select it and deselect any previously selected theme
  - If clicking the currently selected theme, deselect it (optional - can be required selection)
- Visual indication of selected state

### 4. Component Features

#### ThemeSelection Component
- Form validation (optional - can require selection or allow none)
- Auto-save functionality (1 second debounce)
- Dark mode support
- Responsive design
- Loading states
- Success/error messages (if needed)
- Reset functionality

#### Props Interface
```typescript
export interface ThemeSelectionProps {
  themes: Theme[];
  selectedThemeId?: string | null;
  onSelect?: (themeId: string | null) => void;
  onSave?: (data: Partial<ThemeSelection>) => void;
  initialData?: Partial<ThemeSelection>;
  isLoading?: boolean;
  className?: string;
  required?: boolean; // If true, at least one theme must be selected
}
```

### 5. Default Themes

The component should accept themes as props, but for the test page, use these sample themes related to social media posting campaigns:

```typescript
const SAMPLE_THEMES: Theme[] = [
  {
    id: "christmas",
    title: "Christmas",
    description: "Festive holiday content with seasonal messaging, warm colors, and gift-focused promotions. Perfect for December campaigns and holiday shopping."
  },
  {
    id: "new-product-launch",
    title: "New Product Launch",
    description: "Exciting announcement content highlighting new features, benefits, and innovation. Ideal for building anticipation and driving early adoption."
  },
  {
    id: "black-week",
    title: "Black Week",
    description: "High-energy promotional content with special offers, discounts, and limited-time deals. Designed to drive urgency and maximize sales during the shopping event."
  }
];
```

**Note**: These themes are specifically designed for social media posting campaigns and will influence the content structure, messaging tone, and visual style of generated posts.

### 6. Validation Rules

- If `required` prop is true: At least one theme must be selected
- If `required` is false: Selection is optional (can be null)

### 7. Styling & UX

- Follow existing design patterns from other input components
- Use Tailwind CSS classes consistent with the codebase
- Smooth animations and transitions
- Accessible form controls (ARIA labels, keyboard navigation)
- Visual feedback for all interactions
- Selected theme should have distinct visual styling (border color, background tint)

### 8. Test Page Features

The test page (`app/test/theme-selection/page.tsx`) should include:
- Dark mode toggle
- Sample themes pre-configured
- Selection handling
- Display of selected theme
- Reset functionality
- Instructions panel
- Features list

### 9. Type Definitions

Add to `app/ui/input/types.ts`:
- `Theme`
- `ThemeSelection`
- `ThemeSelectionProps`
- `ThemeSelectionValidationErrors` (if validation needed)

### 10. Component Structure

```
ThemeSelection Component
├── Container
│   ├── Label/Title (optional)
│   ├── Theme Cards (3)
│   │   ├── Checkbox
│   │   ├── Title
│   │   └── Description
│   └── Error Message (if validation fails)
└── Success Message (optional)
```

## Implementation Checklist

- [ ] Create `Theme` and `ThemeSelection` type definitions
- [ ] Create `ThemeSelection` component
- [ ] Create test page at `app/test/theme-selection/page.tsx`
- [ ] Implement single-selection checkbox behavior
- [ ] Add visual feedback for selected state
- [ ] Implement auto-save functionality
- [ ] Add dark mode support
- [ ] Test form submission
- [ ] Test error handling
- [ ] Verify responsive design
- [ ] Add accessibility features

## Notes

- The component uses checkboxes but enforces single selection behavior (like radio buttons)
- This follows the user's explicit requirement for checkbox-based selection
- The component is reusable and can accept any number of themes via props
- For the test page, 3 predefined themes will be used (Christmas, New Product Launch, Black Week)
- Selection can be optional or required based on the `required` prop
- Themes are specifically for social media posting campaigns and will structure the content generation
- Themes represent different posting strategies: seasonal (Christmas), promotional (Black Week), and product-focused (New Product Launch)

