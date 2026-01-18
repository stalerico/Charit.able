# Charit.able Design System & Theme Guide

## 🎨 Brand Identity

Charit.able is built around trust, transparency, and social impact. Our design reflects these values through a modern, accessible, and inclusive visual system.

### Mission-Driven Design
- **Trust First**: Green colors convey growth, trust, and positive change
- **Transparent**: Clean, minimal design with clear information hierarchy
- **Impactful**: Bold typography and intentional use of whitespace

---

## 🎯 Color Palette

### Primary Colors
- **Green (Trust & Giving)**: `#10b981` (Emerald-500)
  - Used for: Primary CTAs, donation buttons, trust indicators
  - Hex: `#10b981`
  - RGB: `16, 185, 129`
  - Tailwind: `green-500`

- **Emerald (Growth & Impact)**: `#059669` (Emerald-600)
  - Used for: Hover states, active states
  - Tailwind: `emerald-600`

- **Black (Background)**: `#000000`
  - Used for: Main background, high contrast
  - Tailwind: `black`

### Secondary Colors
- **Cyan (Information)**: `#06b6d4` (Cyan-500)
  - Used for: Secondary actions, information callouts
  - Tailwind: `cyan-500`

- **Gray (Neutral)**: 
  - Dark: `#374151` (Gray-700)
  - Light: `#d1d5db` (Gray-300)
  - Used for: Text, borders, subtle backgrounds

### Accent Colors (Component-specific)
- **Purple**: Corporate/dashboard features
- **Blue**: System messages, secondary information

---

## 📝 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | 3.75rem (60px) | 800 (extrabold) | Page titles, hero headings |
| H2 | 3rem (48px) | 800 (extrabold) | Section headings |
| H3 | 1.875rem (30px) | 800 (extrabold) | Subsection headings |
| H4 | 1.5rem (24px) | 700 (bold) | Card titles, feature heads |
| Body | 1rem (16px) | 400 (normal) | Main text content |
| Small | 0.875rem (14px) | 400 (normal) | Secondary text, captions |
| Caption | 0.75rem (12px) | 400 (normal) | Meta information |

### Font Weights
- **Extrabold (800)**: Headlines, primary CTAs
- **Bold (700)**: Subheadings, emphasis
- **Medium (500)**: Secondary CTAs, labels
- **Normal (400)**: Body text, descriptions

---

## 🖱️ Component Styles

### Buttons

#### Primary Button (Donate/CTA)
```jsx
className="px-9 py-4 rounded-full bg-green-500 text-black font-extrabold 
  hover:bg-green-400 transition shadow-lg shadow-green-500/30"
```
- Background: Green-500 with green shadow
- Text: Black for contrast
- Shape: Fully rounded (pill-shaped)
- Hover: Slight color brighten, shadow increase

#### Secondary Button (Learn More)
```jsx
className="px-9 py-4 rounded-full border-2 border-green-500 text-green-400 
  font-extrabold hover:bg-green-500/10 transition"
```
- Background: Transparent with border
- Border: Green-500, 2px
- Text: Green-400
- Hover: Subtle background tint

#### Tertiary Button (Subtle Actions)
```jsx
className="px-6 py-3 rounded-full bg-white/10 text-white font-medium 
  hover:bg-white/20 border border-white/20 transition"
```
- Background: Semi-transparent white
- Text: White
- Hover: Increased opacity

### Cards

#### Featured Card (Recommended Plan)
```jsx
className="rounded-2xl border border-green-500/50 bg-gradient-to-br 
  from-green-500/10 to-emerald-500/5 p-8 hover:scale-105 transition-all"
```

#### Standard Card
```jsx
className="rounded-2xl border border-gray-700 bg-black/50 p-8 
  hover:border-gray-600 transition-all"
```

---

## 🎬 Animations & Interactions

### Transitions
- Default duration: `300ms`
- Easing: `ease-in-out` (Tailwind default)
- Applied to: hover effects, scale transforms, color changes

### Hover Effects
- Buttons: Scale + shadow enhancement
- Cards: Scale (1.05x) + border color shift
- Links: Opacity change + underline

### Loading States
- Use spinning gradient animations
- Maintain accessibility with reduced-motion support

---

## 📐 Spacing System

Based on Tailwind's default 0.25rem (4px) scale:

| Scale | Pixels | Usage |
|-------|--------|-------|
| 2 | 8px | Tight spacing |
| 3 | 12px | Padding in small elements |
| 4 | 16px | Standard padding |
| 6 | 24px | Component spacing |
| 8 | 32px | Section padding |
| 12 | 48px | Large gaps |
| 16 | 64px | Major section gaps |

### Container Widths
- Max content: `max-w-7xl` (80rem / 1280px)
- Column width: `max-w-4xl` (56rem / 896px)
- Narrow width: `max-w-3xl` (48rem / 768px)

---

## 🎨 Visual Hierarchy

### Page Structure
```
Hero Section (60px heading, 18px body)
    ↓
Feature Rows (30px headings)
    ↓
CTA Buttons (large, prominent)
    ↓
Supporting Content (16px)
```

### Emphasis Techniques
1. **Color**: Green for primary actions
2. **Size**: Larger for important elements
3. **Weight**: Extrabold for headings
4. **Position**: Top/center for critical info
5. **Whitespace**: More space = more importance

---

## ♿ Accessibility Guidelines

### Color Contrast
- Text on dark: Minimum 7:1 ratio (AAA standard)
- Green-500 on black: ✅ Passes (4.9:1)
- White on black: ✅ Passes (21:1)

### Interactive Elements
- Minimum touch target: 44x44px
- All buttons keyboard accessible
- Focus indicators visible with 2px outline

### Dark Mode
- All pages default to dark mode
- No light mode toggle required
- Meet WCAG AAA standards

### Motion
- Respect `prefers-reduced-motion`
- Provide alternative interactions
- No auto-playing animations

---

## 🚀 Component Usage Examples

### Donate Button
```jsx
<button className="px-9 py-4 rounded-full bg-green-500 text-black font-extrabold 
  hover:bg-green-400 transition shadow-lg shadow-green-500/30">
  Donate Now
</button>
```

### Feature Card
```jsx
<div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 
  border border-green-500/20 rounded-lg p-4">
  <div className="text-2xl font-bold text-green-400 mb-2">100%</div>
  <p className="text-sm text-gray-300">Transparent Impact Tracking</p>
</div>
```

### Section Heading
```jsx
<h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 
  to-emerald-400 bg-clip-text text-transparent">
  Trust-First Giving
</h2>
```

### Navigation Item
```jsx
<button className="px-4 py-2 rounded-lg text-green-400 hover:bg-green-400/10 
  transition font-extrabold">
  Donate Now
</button>
```

---

## 📋 Checklist for New Components

- [ ] Uses green or neutral colors (no random colors)
- [ ] Buttons have adequate padding (min 12px vertical, 16px horizontal)
- [ ] Text has 7:1 contrast on black background
- [ ] Headings use extrabold weight
- [ ] Cards have subtle borders and shadows
- [ ] Hover states provided for interactive elements
- [ ] Spacing follows 4px/8px/12px pattern
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Animations respect reduced-motion preference

---

## 🔄 Gradient Usage

### Primary Gradient (Green to Emerald)
```css
background: linear-gradient(to right, #10b981, #059669);
```
Use for: Hero headings, primary emphasis, hero sections

### Subtle Gradient (Green/Emerald with transparency)
```css
background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
```
Use for: Card backgrounds, subtle emphasis

---

## 📚 Design Tokens

```javascript
// Tailwind Config Design Tokens
{
  colors: {
    primary: {
      light: 'rgb(6, 182, 212)',      // cyan-500
      main: 'rgb(16, 185, 129)',      // green-500
      dark: 'rgb(5, 150, 105)',       // emerald-600
    },
    background: 'rgb(0, 0, 0)',
    surface: 'rgba(0, 0, 0, 0.5)',
    text: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(209, 213, 219)',  // gray-300
    }
  }
}
```

---

## 🎯 Brand Voice in Design

**Every design decision reinforces:**
- 🤝 **Trustworthiness**: Green, clear, honest
- 🔍 **Transparency**: Minimal clutter, clear hierarchy
- 💚 **Compassion**: Warm, welcoming, inclusive
- ⚡ **Impact**: Bold, energetic, forward-thinking

---

## 📞 Design Questions?

When creating new components or pages:
1. Does it use the primary green color for CTAs?
2. Is the typography hierarchy clear?
3. Does it pass accessibility standards?
4. Does it align with the charity/giving mission?
5. Is the spacing consistent with 4px scale?

**If yes to all = Ready to ship! 🚀**
