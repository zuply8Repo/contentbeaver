# Welcome Screen Component

## Overview

A modern, full-screen welcome screen component with animated gradient background, designed for the Easfluencer onboarding experience.

## Features

### 🎨 Visual Design

- **Animated Gradient Background**: Beautiful purple-to-pink gradient with floating blob animations
- **No Image Required**: Uses CSS gradients instead of static images for faster loading
- **Glassmorphism Effects**: Modern frosted glass effects on UI elements
- **Smooth Animations**: Staggered text reveals and interactive hover states

### 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices (375px+)
- **Tablet Support**: Adjusted layouts for tablets (768px+)
- **Desktop Ready**: Enhanced experience for large screens (1024px+)

### ⚡ Modern Interactions

- **Staggered Text Animation**: Each word in the heading animates in sequence
- **Shimmer Button Effect**: Interactive button with sliding shimmer on hover
- **Arrow Animation**: Directional arrow slides on button hover
- **Smooth Transitions**: All interactions use CSS transitions (150-300ms)

### ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper accessibility labels
- **Focus Indicators**: Visible focus rings on interactive elements
- **High Contrast**: WCAG AA compliant color contrast

## File Structure

```
easfluencer/
├── app/
│   ├── ui/
│   │   └── welcome-screen.tsx       # Main welcome screen component
│   ├── welcome/
│   │   └── page.tsx                 # Welcome screen page route
│   └── onboarding/
│       └── generalInfo/
│           └── page.tsx             # Onboarding landing page
```

## Routes

- **`/welcome`** - Welcome screen with call-to-action
- **`/onboarding/generalInfo`** - First step of onboarding flow
- **`/`** - Updated homepage with navigation cards

## Usage

### Basic Usage

```tsx
import WelcomeScreen from "@/app/ui/welcome-screen";

export default function MyPage() {
  return <WelcomeScreen />;
}
```

### With Custom Props

```tsx
import WelcomeScreen from "@/app/ui/welcome-screen";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();

  const handleStart = () => {
    console.log("User clicked start!");
    // Custom logic before navigation
  };

  return (
    <WelcomeScreen
      onStart={handleStart}
      heading="Welcome to Easfluencer"
      buttonText="Get Started"
    />
  );
}
```

## Props

| Prop         | Type         | Default                           | Description                                            |
| ------------ | ------------ | --------------------------------- | ------------------------------------------------------ |
| `onStart`    | `() => void` | `undefined`                       | Callback function when "Let's Start" button is clicked |
| `heading`    | `string`     | `"Let's configure your business"` | Main heading text                                      |
| `buttonText` | `string`     | `"Let's Start"`                   | Button text                                            |

## Animations

### Text Animation

Each word in the heading animates independently with a staggered delay (0.1s between words).

### Background Animation

- **Gradient**: Smooth color shifting (15s cycle)
- **Blobs**: Three floating blobs with different animation delays (7s cycle)

### Button Animation

- **Hover**: Scale up (1.05x) with shadow enhancement
- **Active**: Scale down (0.95x) for tactile feedback
- **Shimmer**: Sliding shimmer effect on hover

## Navigation Flow

```
Homepage (/)
    ↓
Welcome Screen (/welcome)
    ↓
General Info (/onboarding/generalInfo)
    ↓
[Your onboarding flow continues...]
```

## Customization

### Change Colors

Edit the gradient in `welcome-screen.tsx`:

```tsx
// Current gradient
<div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient">

// Custom gradient
<div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 animate-gradient">
```

### Adjust Animation Speed

Modify the animation durations in the `<style jsx>` section:

```css
/* Current speed */
.animate-blob {
  animation: blob 7s infinite;
}

/* Faster animation */
.animate-blob {
  animation: blob 4s infinite;
}
```

### Add Background Image

If you want to use an actual image instead of gradients:

```tsx
// Replace the gradient div with:
<div className="absolute inset-0">
  <Image
    src="/your-background.jpg"
    alt="Background"
    fill
    className="object-cover"
    priority
  />
</div>
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **No external images**: Faster initial load
- **CSS animations**: Hardware-accelerated
- **Lazy loading**: Component mounts before animations trigger
- **Optimized re-renders**: Minimal state updates

## Future Enhancements

Potential improvements:

- [ ] Add parallax scroll effect
- [ ] Integrate with user authentication
- [ ] Add skip button for returning users
- [ ] Multi-language support
- [ ] Custom background image upload
- [ ] Dark mode variant

## Testing

To test the welcome screen:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to:

   - `http://localhost:3000/welcome` - See the welcome screen
   - `http://localhost:3000` - Navigate from homepage
   - `http://localhost:3000/onboarding/generalInfo` - See destination

3. Test interactions:
   - Hover over the button
   - Click the button to navigate
   - Test on different screen sizes
   - Test keyboard navigation (Tab, Enter)

## Troubleshooting

### Animations not working

- Ensure Tailwind CSS is properly configured
- Check browser console for errors
- Verify `"use client"` directive is at the top of the file

### Navigation not working

- Verify `/onboarding/generalInfo/page.tsx` exists
- Check Next.js router import
- Ensure the app is in client component mode

### Styling issues

- Clear Next.js cache: `rm -rf .next`
- Restart development server
- Check Tailwind CSS configuration

## Credits

- **Design**: Modern gradient aesthetics with glassmorphism
- **Animation**: CSS keyframe animations
- **Icons**: Heroicons
- **Framework**: Next.js 16 + React 19 + Tailwind CSS 4

---

**Created**: November 2025  
**Version**: 1.0.0  
**Component Type**: Client Component
