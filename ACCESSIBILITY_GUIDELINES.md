# Accessibility Guidelines - WCAG 2.1 AA Compliance

**Version:** 1.0  
**Standard:** WCAG 2.1 Level AA  
**Purpose:** Ensure Ntumai is accessible to all users, including those with disabilities

---

## 1. Accessibility Overview

### What is Accessibility?

Accessibility means designing digital products so that everyone can use them, regardless of ability. This includes people with:
- Visual impairments (blindness, low vision, color blindness)
- Hearing impairments (deafness, hard of hearing)
- Motor impairments (limited mobility, tremors, paralysis)
- Cognitive impairments (dyslexia, ADHD, autism)
- Temporary impairments (broken arm, eye surgery)

### Why Accessibility Matters

- **Legal:** WCAG 2.1 compliance is required by law in many countries
- **Ethical:** Everyone deserves equal access to digital services
- **Business:** Accessible design benefits all users (better UX, larger audience)
- **Technical:** Accessibility improvements often improve overall code quality

### WCAG 2.1 Principles

**Perceivable:** Information must be perceivable to users  
**Operable:** Users must be able to navigate and interact  
**Understandable:** Content must be clear and easy to understand  
**Robust:** Content must work with assistive technologies  

---

## 2. Visual Accessibility

### Color Contrast

**WCAG 2.1 AA Requirements:**
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio minimum
- UI components: 3:1 contrast ratio minimum

**Testing Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Color Contrast Analyzer: https://www.tpgi.com/color-contrast-checker/
- Lighthouse (Chrome DevTools): Built-in contrast checker

**Examples:**

| Foreground | Background | Ratio | Status |
| :--- | :--- | :--- | :--- |
| #08AF97 (Teal) | #FFFFFF (White) | 4.5:1 | ✓ Pass |
| #FFE536 (Yellow) | #FFFFFF (White) | 1.2:1 | ✗ Fail |
| #333333 (Dark Gray) | #FFFFFF (White) | 7:1 | ✓ Pass |
| #666666 (Medium Gray) | #FFFFFF (White) | 4.5:1 | ✓ Pass |

**Best Practices:**
- Always test color combinations before using
- Don't rely on color alone to convey information
- Use patterns or icons in addition to color
- Provide sufficient contrast for all text
- Test with color blindness simulators

### Text Sizing & Readability

**Font Size Guidelines:**
- Minimum: 12px (mobile), 14px (web)
- Recommended: 16px (body text)
- Headings: 24px-32px
- Captions: 11px-12px

**Line Height Guidelines:**
- Body text: 1.5x font size minimum
- Headings: 1.2x-1.3x font size
- Mobile: 1.6x font size (more space needed)

**Letter Spacing:**
- Body text: 0.12em minimum
- Headings: 0.02em-0.05em
- Avoid: Negative letter spacing

**Line Length:**
- Optimal: 50-75 characters per line
- Maximum: 100 characters per line
- Mobile: 40-60 characters per line

**Implementation:**
```css
body {
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.02em;
  max-width: 75ch;
}

h1 {
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Images & Icons

**Alt Text Guidelines:**
- Provide descriptive alt text for all images
- Keep alt text concise (under 125 characters)
- Don't start with "image of" or "picture of"
- For decorative images, use empty alt text (`alt=""`)
- For icons, use aria-label or title attribute

**Examples:**

| Image | Alt Text | Status |
| :--- | :--- | :--- |
| Product photo | "Grilled chicken sandwich with lettuce and tomato" | ✓ Good |
| App logo | "Ntumai logo" | ✓ Good |
| Decorative divider | "" (empty) | ✓ Good |
| Chart/graph | "Sales increased 25% in Q4 2025" | ✓ Good |
| "Image of food" | "Image of food" | ✗ Bad |
| Blank alt | (no alt attribute) | ✗ Bad |

**Icon Implementation:**
```html
<!-- Good: Icon with aria-label -->
<button aria-label="Close menu">
  <svg><!-- close icon --></svg>
</button>

<!-- Good: Icon with title -->
<svg title="Location">
  <!-- location icon -->
</svg>

<!-- Bad: Icon without label -->
<button>
  <svg><!-- close icon --></svg>
</button>
```

### Visual Indicators

**Don't Rely on Color Alone:**
- Use icons, patterns, or text in addition to color
- Example: Instead of just red for errors, use red + ✗ icon + error message

**Visual Feedback:**
- Provide clear focus indicators for keyboard navigation
- Use underlines for links (not just color)
- Use icons for status indicators (not just color)

**Implementation:**
```css
/* Good: Focus indicator */
button:focus {
  outline: 3px solid #08AF97;
  outline-offset: 2px;
}

/* Good: Link underline */
a {
  color: #08AF97;
  text-decoration: underline;
}

/* Good: Status with icon + color */
.error {
  color: #F44336;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error::before {
  content: "✗";
  font-weight: bold;
}
```

---

## 3. Keyboard Navigation

### Keyboard Support

**WCAG 2.1 Requirement:** All functionality must be operable via keyboard

**Essential Keys:**
- Tab: Move to next interactive element
- Shift+Tab: Move to previous interactive element
- Enter: Activate button or link
- Space: Toggle checkbox or radio button
- Arrow Keys: Navigate within components (menus, sliders, etc.)
- Escape: Close modals or menus

**Implementation Checklist:**
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical and intuitive
- [ ] Tab order follows visual order
- [ ] No keyboard traps (can't escape with keyboard)
- [ ] Focus indicator is visible (outline, highlight, etc.)
- [ ] Keyboard shortcuts are documented

### Focus Management

**Focus Indicator:**
- Visible outline (minimum 2px)
- Sufficient contrast (3:1 minimum)
- Clear distinction from default state

**Implementation:**
```css
/* Visible focus indicator */
*:focus {
  outline: 3px solid #08AF97;
  outline-offset: 2px;
}

/* Remove default outline only if replacing with custom */
button:focus-visible {
  outline: 3px solid #08AF97;
  outline-offset: 2px;
}

/* Don't remove focus indicator */
/* Bad: button:focus { outline: none; } */
```

**Focus Order:**
```html
<!-- Good: Logical tab order -->
<button>Home</button>
<button>Products</button>
<button>Contact</button>

<!-- Bad: Illogical tab order -->
<button tabindex="3">Home</button>
<button tabindex="1">Products</button>
<button tabindex="2">Contact</button>
```

### Skip Links

**Purpose:** Allow keyboard users to skip repetitive content

**Implementation:**
```html
<!-- Skip link (hidden by default, visible on focus) -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<nav><!-- Navigation --></nav>

<main id="main-content">
  <!-- Main content -->
</main>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #08AF97;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

---

## 4. Screen Reader Accessibility

### Semantic HTML

**Use semantic elements for structure:**
```html
<!-- Good: Semantic HTML -->
<header>
  <nav><!-- Navigation --></nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content</p>
  </article>
</main>
<footer>
  <!-- Footer content -->
</footer>

<!-- Bad: Non-semantic HTML -->
<div class="header">
  <div class="nav"><!-- Navigation --></div>
</div>
<div class="main">
  <div class="article">
    <div class="h1">Article Title</div>
    <div>Article content</div>
  </div>
</div>
```

### ARIA Attributes

**ARIA (Accessible Rich Internet Applications):** Provides additional semantic information

**Common ARIA Attributes:**

| Attribute | Purpose | Example |
| :--- | :--- | :--- |
| `aria-label` | Provides accessible name | `<button aria-label="Close menu">✕</button>` |
| `aria-labelledby` | Links element to label | `<h2 id="title">Title</h2><div aria-labelledby="title">` |
| `aria-describedby` | Provides description | `<input aria-describedby="hint">` |
| `aria-hidden` | Hides from screen readers | `<span aria-hidden="true">→</span>` |
| `aria-live` | Announces dynamic content | `<div aria-live="polite">` |
| `aria-expanded` | Indicates expanded/collapsed state | `<button aria-expanded="false">` |
| `aria-current` | Indicates current page/item | `<a href="/" aria-current="page">` |
| `role` | Defines element role | `<div role="button">` |

**Implementation Examples:**

```html
<!-- Good: Button with aria-label -->
<button aria-label="Close menu">
  <svg><!-- close icon --></svg>
</button>

<!-- Good: Expandable section -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<nav id="menu" hidden>
  <!-- Menu items -->
</nav>

<!-- Good: Form with error -->
<input aria-describedby="error-message">
<span id="error-message" role="alert">
  Email is required
</span>

<!-- Good: Current page link -->
<a href="/" aria-current="page">Home</a>
```

### Heading Structure

**Use proper heading hierarchy:**
```html
<!-- Good: Proper hierarchy -->
<h1>Page Title</h1>
<h2>Section 1</h2>
<p>Content</p>
<h3>Subsection 1.1</h3>
<p>Content</p>
<h2>Section 2</h2>
<p>Content</p>

<!-- Bad: Skipping levels -->
<h1>Page Title</h1>
<h3>Section 1</h3>  <!-- Skipped h2 -->
<p>Content</p>
```

### Lists

**Use semantic list elements:**
```html
<!-- Good: Unordered list -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Good: Ordered list -->
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<!-- Bad: Divs instead of lists -->
<div>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 5. Form Accessibility

### Form Labels

**Always associate labels with inputs:**
```html
<!-- Good: Label with for attribute -->
<label for="email">Email Address</label>
<input id="email" type="email">

<!-- Good: Label wraps input -->
<label>
  Email Address
  <input type="email">
</label>

<!-- Bad: No label -->
<input type="email" placeholder="Email">

<!-- Bad: Label not associated -->
<label>Email Address</label>
<input type="email">
```

### Form Validation

**Provide clear error messages:**
```html
<!-- Good: Error with aria-describedby -->
<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-error"
>
<span id="password-error" role="alert">
  Password must be at least 8 characters
</span>

<!-- Good: Required field indicator -->
<label for="name">
  Name <span aria-label="required">*</span>
</label>
<input id="name" required>

<!-- Bad: Error message not linked -->
<input type="password">
<span>Password must be at least 8 characters</span>
```

### Form Instructions

**Provide clear instructions:**
```html
<!-- Good: Instructions with aria-describedby -->
<label for="phone">Phone Number</label>
<span id="phone-hint">Format: (123) 456-7890</span>
<input
  id="phone"
  type="tel"
  aria-describedby="phone-hint"
>

<!-- Good: Grouped related fields -->
<fieldset>
  <legend>Delivery Address</legend>
  <input type="text" placeholder="Street">
  <input type="text" placeholder="City">
  <input type="text" placeholder="Zip Code">
</fieldset>
```

---

## 6. Motion & Animation Accessibility

### Respect prefers-reduced-motion

**WCAG 2.1 Requirement:** Respect user's motion preferences

**Implementation:**
```css
/* Default animation */
@keyframes slide {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

button {
  animation: slide 300ms ease-out;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Guidelines

**Avoid:**
- Parallax scrolling (can cause motion sickness)
- Rapid flashing (more than 3x per second)
- Auto-playing videos with sound
- Unexpected animations

**Provide:**
- Static alternatives for critical animations
- Pause/stop controls for animations
- Clear indication of animated content

---

## 7. Mobile & Touch Accessibility

### Touch Targets

**WCAG 2.1 Requirement:** Touch targets must be at least 44x44 CSS pixels

**Implementation:**
```css
/* Good: 48x48px touch target */
button {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 24px;
}

/* Good: Adequate spacing between targets */
button + button {
  margin-left: 8px;
}

/* Bad: Too small touch target */
button {
  width: 30px;
  height: 30px;
}
```

### Mobile Gestures

**Provide alternatives to complex gestures:**
- Swipe: Provide buttons or links as alternative
- Long-press: Provide context menu via button
- Pinch-to-zoom: Allow zoom via controls

**Implementation:**
```html
<!-- Good: Gesture with button alternative -->
<div>
  <!-- Swipe to dismiss or click button -->
  <button aria-label="Dismiss">Dismiss</button>
</div>

<!-- Good: Long-press with menu button -->
<button aria-label="More options" aria-expanded="false">
  ⋮
</button>
```

### Orientation

**Support both portrait and landscape:**
```css
/* Good: Responsive design supports both orientations */
@media (orientation: portrait) {
  /* Portrait styles */
}

@media (orientation: landscape) {
  /* Landscape styles */
}

/* Good: Don't lock orientation -->
/* Avoid: -webkit-user-select: none; */
```

---

## 8. Content Accessibility

### Plain Language

**Write clearly and concisely:**
- Use short sentences (15-20 words)
- Use common words (avoid jargon)
- Use active voice
- Use lists for multiple items
- Define abbreviations on first use

**Examples:**

| Bad | Good |
| :--- | :--- |
| "Utilize the aforementioned functionality" | "Use this feature" |
| "Expedite your order processing" | "Speed up your order" |
| "Authenticate your credentials" | "Log in" |
| "Remuneration for services rendered" | "Payment for your work" |

### Abbreviations & Acronyms

**Define on first use:**
```html
<!-- Good: Define abbreviation -->
<abbr title="Application Programming Interface">API</abbr>

<!-- Good: Expand acronym -->
<p>
  The <abbr title="World Wide Web Consortium">W3C</abbr>
  sets web standards.
</p>

<!-- Bad: No definition -->
<p>Use the API to integrate</p>
```

### Links

**Make link text descriptive:**
```html
<!-- Good: Descriptive link text -->
<a href="/orders">View your orders</a>

<!-- Bad: Generic link text -->
<a href="/orders">Click here</a>

<!-- Bad: Link text is URL -->
<a href="https://example.com">https://example.com</a>
```

---

## 9. Testing & Validation

### Automated Testing

**Tools:**
- Lighthouse (Chrome DevTools): Built-in accessibility audit
- WAVE (WebAIM): Browser extension for accessibility checking
- Axe DevTools: Comprehensive accessibility testing
- NVDA: Free screen reader (Windows)
- JAWS: Commercial screen reader (Windows)
- VoiceOver: Built-in screen reader (macOS, iOS)

**Running Lighthouse Audit:**
1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Accessibility"
4. Click "Analyze page load"
5. Review results and fix issues

### Manual Testing

**Keyboard Navigation:**
- Tab through entire page
- Verify focus order is logical
- Verify all functionality is keyboard accessible
- Verify no keyboard traps

**Screen Reader Testing:**
- Use NVDA, JAWS, or VoiceOver
- Navigate page with screen reader
- Verify all content is announced correctly
- Verify form labels are associated
- Verify headings are properly structured

**Color Contrast:**
- Test all text color combinations
- Use WebAIM Contrast Checker
- Verify 4.5:1 for normal text
- Verify 3:1 for large text

**Mobile Testing:**
- Test with screen reader enabled
- Test touch targets are 44x44px
- Test in both portrait and landscape
- Test with zoom enabled (200%)

### Accessibility Audit Checklist

**Before Launch:**

- [ ] All images have descriptive alt text
- [ ] All form inputs have labels
- [ ] All buttons have accessible names
- [ ] Color contrast is 4.5:1 minimum
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Heading hierarchy is correct
- [ ] Links have descriptive text
- [ ] Errors are clearly indicated
- [ ] Motion respects prefers-reduced-motion
- [ ] Touch targets are 44x44px minimum
- [ ] Page is tested with screen reader
- [ ] Page passes Lighthouse accessibility audit
- [ ] Page is tested on mobile devices

---

## 10. Accessibility Resources

### Learning Resources

- **WebAIM:** https://webaim.org/
- **W3C WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **A11y Project:** https://www.a11yproject.com/

### Testing Tools

- **Lighthouse:** Built into Chrome DevTools
- **WAVE:** https://wave.webaim.org/
- **Axe DevTools:** https://www.deque.com/axe/devtools/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **NVDA Screen Reader:** https://www.nvaccess.org/

### Screen Readers

- **NVDA (Free):** https://www.nvaccess.org/
- **JAWS (Paid):** https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver (Built-in):** macOS, iOS
- **TalkBack (Built-in):** Android

---

## 11. Accessibility Support

### Getting Help

- **Accessibility Team:** [Contact Information]
- **WCAG Questions:** https://www.w3.org/WAI/
- **A11y Slack:** https://a11y.slack.com/
- **Accessibility Consulting:** Consider hiring accessibility experts

### Reporting Issues

- Report accessibility issues to: accessibility@ntumai.com
- Include: Screen, browser, assistive technology, steps to reproduce
- Provide: Expected behavior vs. actual behavior

---

## 12. Accessibility Commitment

Ntumai is committed to ensuring digital accessibility for all users. We will:

- Follow WCAG 2.1 Level AA guidelines
- Test with real users with disabilities
- Continuously improve accessibility
- Provide accessibility support
- Train team members on accessibility
- Review and update accessibility practices regularly

