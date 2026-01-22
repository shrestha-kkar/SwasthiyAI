# Design System & Component Guide

## Overview
This guide documents the modern design system applied across SwasthiyAI dashboard pages for consistent, professional, and user-friendly interfaces.

## Color System

### Primary Colors
```
Blue Suite:
- bg-blue-50: Light background
- bg-blue-100: Card hover state
- bg-blue-600: Primary button/active state
- bg-blue-700: Button hover state
- text-blue-600: Primary text
- border-blue-200: Card border

Green Suite:
- bg-green-50: Success background
- bg-green-100: Card hover state
- bg-green-600: Success button
- text-green-700: Success text
- border-green-200: Card border

Purple Suite:
- bg-purple-50: Alternative background
- bg-purple-100: Card hover state
- bg-purple-600: Alternative button
- text-purple-700: Alternative text
- border-purple-200: Card border
```

### Semantic Colors
- **Success/Green**: Completed, confirmed, active status
- **Blue**: Primary actions, scheduled items, information
- **Purple**: Alternative actions, secondary items
- **Red**: Errors, warnings, cancellations
- **Gray**: Disabled states, secondary text

---

## Typography System

### Heading Hierarchy
```tsx
// H1 - Page Title
<h1 className="text-4xl font-bold text-gray-900">Page Title</h1>

// H2 - Section Title
<h2 className="text-xl font-bold text-gray-900">Section Title</h2>

// H3 - Card Title
<h3 className="text-lg font-bold text-gray-900">Card Title</h3>

// Subtitle
<p className="text-gray-600">Descriptive subtitle</p>

// Label
<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Label</p>

// Body Text
<p className="text-sm text-gray-700">Regular body text</p>
```

### Font Weights
- `font-bold` (700): Headlines, important text
- `font-semibold` (600): Labels, subheadings
- `font-medium` (500): Emphasis in body text
- `font-normal` (400): Default body text

---

## Spacing System

### Padding
```
Component Padding:
- p-3: Small elements (chips, small cards)
- p-4: Medium elements (form inputs, small cards)
- p-5: Card content
- p-6: Large cards/sections
- p-12: Large empty states

Specific Padding:
- px-3 py-1: Badge/chip
- px-4 py-2: Small button
- px-5 py-3: Default button
- px-6 py-2: Large button
```

### Margin
```
Spacing Between Elements:
- gap-2: Tight grouping (icons + text)
- gap-3: Regular spacing between items
- gap-4: Card-to-card spacing
- gap-6: Major section spacing

Vertical Spacing:
- mb-1: Minimal spacing
- mb-2: Small heading-subtitle gap
- mb-3: Between form elements
- mb-4: Section gaps
- space-y-4: Between cards
- space-y-6: Between major sections
- space-y-8: Large section gaps
```

---

## Shadow System

### Shadow Levels
```
Subtle (Resting State):
- shadow-sm: Tables, inactive cards
- No shadow: Flat design elements

Emphasis (Interactive):
- shadow-lg: Active cards, focused elements
- shadow-xl: Hover states

Pressed State:
- shadow-none: On click/active
```

### Implementation
```tsx
// Base card
<div className="rounded-2xl shadow-lg border border-blue-200 p-6">

// Hover effect
<div className="hover:shadow-xl transition-all transform hover:scale-105">

// Focused/Active state
<div className="shadow-xl">
```

---

## Card Components

### Standard Card
```tsx
<div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    <span>⚡</span> Title
  </h2>
  {/* Content */}
</div>
```

### Gradient Card
```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg p-6">
  {/* Content */}
</div>
```

### Stat Card
```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
  <div className="flex items-center justify-between mb-2">
    <span className="text-2xl">📅</span>
    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
      Label
    </span>
  </div>
  <p className="text-sm text-blue-700 mb-2">Metric Name</p>
  <p className="text-4xl font-bold text-blue-600">123</p>
</div>
```

### Action Card
```tsx
<Link
  href="/path"
  className="group flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition border border-blue-200 cursor-pointer"
>
  <span className="text-2xl group-hover:scale-110 transition">📝</span>
  <div>
    <p className="font-semibold text-gray-900 text-sm">Action Title</p>
    <p className="text-xs text-gray-600">Subtitle</p>
  </div>
</Link>
```

---

## Button Styles

### Primary Button
```tsx
<button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
  Primary Action
</button>
```

### Secondary Button
```tsx
<button className="px-5 py-2 rounded-lg font-semibold transition-all text-sm bg-white text-blue-600 border border-blue-200 hover:bg-blue-50">
  Secondary Action
</button>
```

### Disabled State
```tsx
<button disabled className="px-6 py-2 bg-gray-400 text-gray-600 font-semibold rounded-lg cursor-not-allowed">
  Disabled
</button>
```

### Icon Button
```tsx
<button className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
  🔄 Action with Icon
</button>
```

---

## Input Styles

### Form Input
```tsx
<input
  type="text"
  placeholder="Placeholder text..."
  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed transition"
/>
```

### Icon-Prefixed Input
```tsx
<div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
  <span>📧</span>
  <input
    type="email"
    placeholder="Email address"
    className="flex-1 outline-none"
  />
</div>
```

---

## Status Badges

### Success Badge
```tsx
<span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">
  ✅ Completed
</span>
```

### Pending Badge
```tsx
<span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">
  ⏳ Pending
</span>
```

### Info Badge
```tsx
<span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
  Info Label
</span>
```

---

## Message Components

### Error Message
```tsx
<div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-xl font-medium flex items-start gap-3">
  <span>⚠️</span>
  <div>
    <p className="font-bold mb-1">Error Title</p>
    <p className="text-sm">Error description</p>
  </div>
</div>
```

### Success Message
```tsx
<div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-green-700 rounded-xl font-medium flex items-start gap-3">
  <span>✅</span>
  <div>
    <p className="font-bold mb-1">Success</p>
    <p className="text-sm">Success message</p>
  </div>
</div>
```

### Info Message
```tsx
<div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
  <span className="text-2xl">💡</span>
  <div>
    <p className="text-sm font-semibold text-blue-900 mb-1">Tip Title</p>
    <p className="text-sm text-blue-700">Helpful information</p>
  </div>
</div>
```

---

## Loading States

### Animated Emoji Spinner
```tsx
<div className="text-4xl mb-3 animate-bounce">🔄</div>
```

### Bouncing Dots Loader
```tsx
<div className="flex gap-2">
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
</div>
```

### Spinner
```tsx
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
```

---

## Empty States

### Generic Empty State
```tsx
<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
  <div className="text-4xl mb-3">😌</div>
  <p className="text-gray-900 text-lg font-semibold mb-2">No items found</p>
  <p className="text-gray-600 max-w-sm mx-auto">Helpful message about why there are no items</p>
</div>
```

---

## Layout Patterns

### Two-Column Grid
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left column */}
  <div>Content</div>
  {/* Right column */}
  <div>Content</div>
</div>
```

### Three-Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### Page Layout
```tsx
<div className="space-y-8">
  {/* Header */}
  <div>
    <h1 className="text-4xl font-bold text-gray-900 mb-2">Title</h1>
    <p className="text-gray-600">Subtitle</p>
  </div>

  {/* Content sections with space-y-8 between them */}
</div>
```

---

## Responsive Breakpoints

```
Mobile First:
- No prefix: 0px and up (mobile)
- md: 768px and up (tablet)
- lg: 1024px and up (desktop)
- xl: 1280px and up (large desktop)

Examples:
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- text-2xl md:text-3xl lg:text-4xl
- p-4 md:p-6 lg:p-8
```

---

## Hover & Transition Effects

### Scale Transform
```tsx
className="transform hover:scale-105 transition"
```

### Shadow Enhancement
```tsx
className="shadow-lg hover:shadow-xl transition"
```

### Color Transition
```tsx
className="bg-blue-600 hover:bg-blue-700 transition"
```

### Combined Interaction
```tsx
className="shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
```

---

## Best Practices

### Do's ✅
- Use consistent spacing (gap-4, space-y-6)
- Apply gradients to cards for visual interest
- Use emoji icons for quick visual recognition
- Add hover effects to interactive elements
- Maintain color consistency per section
- Use clear typography hierarchy
- Provide visual feedback on all interactions
- Test responsive design on multiple devices

### Don'ts ❌
- Mix different shadow levels arbitrarily
- Use more than 3 colors in a single card
- Forget to add hover states
- Use generic gray backgrounds everywhere
- Make text too small (<12px)
- Forget loading and empty states
- Ignore responsive design
- Add animations without purpose

---

## Implementation Checklist

- [ ] Use gradient backgrounds for card containers
- [ ] Add shadow-lg to cards and shadow-xl on hover
- [ ] Include emoji icons for visual indicators
- [ ] Apply color-coding for status badges
- [ ] Implement responsive grid layouts
- [ ] Add hover scale and shadow effects
- [ ] Use semantic HTML structure
- [ ] Include loading states
- [ ] Design empty states
- [ ] Test accessibility (contrast, keyboard nav)
- [ ] Verify responsive on mobile/tablet/desktop
- [ ] Test form interactions
- [ ] Verify all animations smooth
- [ ] Check cross-browser compatibility

---

**Last Updated**: 2024
**Design System Version**: 1.0
**Status**: ✅ Production Ready
