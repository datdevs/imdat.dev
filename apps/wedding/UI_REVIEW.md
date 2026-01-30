# Wedding App UI Review

Review conducted against Vercel Web Interface Guidelines and accessibility best practices.

## apps/wedding/src/components/aside.tsx

apps/wedding/src/components/aside.tsx:49 - menu toggle button missing aria-label
apps/wedding/src/components/aside.tsx:69 - close button missing aria-label  
apps/wedding/src/components/aside.tsx:62 - transition-all anti-pattern (should list specific properties)
apps/wedding/src/components/aside.tsx:103 - transition-all anti-pattern (should list specific properties)
apps/wedding/src/components/aside.tsx:58 - aside needs aria-label or aria-labelledby for screen readers
apps/wedding/src/components/aside.tsx:95 - nav needs aria-label for navigation context
apps/wedding/src/components/aside.tsx:100 - aria-describedby references non-existent id (menu.labelKey)
apps/wedding/src/components/aside.tsx:49 - button needs keyboard handler (Enter/Space) - currently only onClick
apps/wedding/src/components/aside.tsx:69 - close button needs keyboard handler
apps/wedding/src/components/aside.tsx:49 - button needs visible focus state
apps/wedding/src/components/aside.tsx:69 - close button needs visible focus state

## apps/wedding/src/components/scroll-indicator.tsx

apps/wedding/src/components/scroll-indicator.tsx:10 - icon-only link missing aria-label
apps/wedding/src/components/scroll-indicator.tsx:10 - HeartIcon decorative icon needs aria-hidden="true"
apps/wedding/src/components/scroll-indicator.tsx:9 - animate-bounce animation missing prefers-reduced-motion support
apps/wedding/src/components/scroll-indicator.tsx:10 - link needs visible focus state

## apps/wedding/src/components/slider.tsx

apps/wedding/src/components/slider.tsx:57 - Image alt="Slide" too generic, should be descriptive
apps/wedding/src/components/slider.tsx:50 - animation missing prefers-reduced-motion support
apps/wedding/src/components/slider.tsx:31 - allowTouchMove={false} may impact accessibility (should allow touch for navigation)
apps/wedding/src/components/slider.tsx:38 - Swiper needs aria-label for carousel context
apps/wedding/src/components/slider.tsx:44 - SwiperSlide needs aria-label or aria-labelledby

## apps/wedding/src/components/gallery-filter.tsx

apps/wedding/src/components/gallery-filter.tsx:18 - filter buttons need aria-pressed state for active filter
apps/wedding/src/components/gallery-filter.tsx:18 - buttons need aria-label describing filter action
apps/wedding/src/components/gallery-filter.tsx:9 - e.preventDefault() on button click is unnecessary (buttons don't navigate)
apps/wedding/src/components/gallery-filter.tsx:15 - ul needs aria-label for filter group context
apps/wedding/src/components/gallery-filter.tsx:18 - buttons need visible focus state
apps/wedding/src/components/gallery-filter.tsx:18 - buttons need keyboard navigation (Arrow keys for filter navigation)

## apps/wedding/src/components/gallery-item.tsx

apps/wedding/src/components/gallery-item.tsx:13 - anchor tag needs aria-label describing image action
apps/wedding/src/components/gallery-item.tsx:18 - decorative gallery-detail div should have aria-hidden="true"
apps/wedding/src/components/gallery-item.tsx:13 - link needs visible focus state

## apps/wedding/src/components/gallery-section.tsx

apps/wedding/src/components/gallery-section.tsx:122 - LightGallery needs aria-label for gallery context
apps/wedding/src/components/gallery-section.tsx:122 - large image lists (>50) should consider virtualization
apps/wedding/src/components/gallery-section.tsx:36 - useEffect with layout reads (getBoundingClientRect via Isotope) - should batch reads/writes

## apps/wedding/src/components/countdown-section.tsx

apps/wedding/src/components/countdown-section.tsx:75 - countdown timer needs aria-live="polite" for screen reader updates
apps/wedding/src/components/countdown-section.tsx:88 - ul needs aria-label for countdown context
apps/wedding/src/components/countdown-section.tsx:72 - bg-fixed (background-attachment: fixed) may cause performance issues on mobile
apps/wedding/src/components/countdown-section.tsx:54 - setInterval updates every second - consider throttling for performance

## apps/wedding/src/components/countdown-item.tsx

apps/wedding/src/components/countdown-item.tsx:12 - span with id should be associated with label via aria-labelledby
apps/wedding/src/components/countdown-item.tsx:15 - label span needs proper semantic association with value

## apps/wedding/src/components/social-links.tsx

apps/wedding/src/components/social-links.tsx:74 - icon-only links missing aria-label (should include platform name)
apps/wedding/src/components/social-links.tsx:81 - Icon components need aria-hidden="true" (text label provides context)
apps/wedding/src/components/social-links.tsx:74 - links need visible focus state

## apps/wedding/src/components/person-card.tsx

apps/wedding/src/components/person-card.tsx:16 - Image has proper alt attribute ✓
apps/wedding/src/components/person-card.tsx:26 - h6 should be h2 or h3 for proper heading hierarchy (person name is important)

## apps/wedding/src/components/hero-overlay.tsx

apps/wedding/src/components/hero-overlay.tsx:9 - h1 has proper semantic usage ✓
apps/wedding/src/components/hero-overlay.tsx:8 - pointer-events-none prevents interaction but may impact accessibility (ensure content is accessible)

## apps/wedding/src/components/google-maps-link.tsx

apps/wedding/src/components/google-maps-link.tsx:21 - GoogleMapsIcon needs aria-hidden="true" (text label provides context)
apps/wedding/src/components/google-maps-link.tsx:13 - Link has proper target="\_blank" with rel="noopener noreferrer" ✓

## apps/wedding/src/styles/index.css

apps/wedding/src/styles/index.css:8 - outline: none without focus-visible replacement
apps/wedding/src/styles/index.css:179 - outline: none without focus-visible replacement
apps/wedding/src/styles/index.css:61 - transition: all anti-pattern (should list specific properties)
apps/wedding/src/styles/index.css:69 - transition: all anti-pattern
apps/wedding/src/styles/index.css:452 - transition: all anti-pattern
apps/wedding/src/styles/index.css:467 - transition: all anti-pattern
apps/wedding/src/styles/index.css:527 - transition: all anti-pattern
apps/wedding/src/styles/index.css:649 - transition: all anti-pattern
apps/wedding/src/styles/index.css:285 - scrollbar width: 0 may hide scrollbar completely (consider min-width for accessibility)
apps/wedding/src/styles/index.css:334 - @include media-breakpoint-up(md) uses SCSS syntax but file is .css (may not work)

## apps/wedding/src/styles/tailwind.css

apps/wedding/src/styles/tailwind.css:61 - button styles may override focus states - verify focus-visible:ring-\* is applied

## apps/wedding/src/app/layout.tsx

apps/wedding/src/app/layout.tsx:96 - html lang attribute properly set ✓
apps/wedding/src/app/layout.tsx:96 - scroll-smooth may conflict with prefers-reduced-motion
apps/wedding/src/app/layout.tsx:24 - Intl.DateTimeFormat usage for dates ✓ (in aside.tsx)

## apps/wedding/src/app/[lang]/page.tsx

apps/wedding/src/app/[lang]/page.tsx:73 - main element properly used ✓
apps/wedding/src/app/[lang]/page.tsx:73 - main needs skip link for keyboard navigation
apps/wedding/src/app/[lang]/page.tsx:74 - HeroSection should have id="hero" for skip link target

## General Issues

### Accessibility

- Missing skip link to main content
- Several icon-only buttons/links missing aria-label
- Filter buttons missing aria-pressed state
- Countdown timer missing aria-live for screen readers
- Some decorative icons not marked with aria-hidden

### Focus States

- Multiple interactive elements missing visible focus indicators
- outline: none used without focus-visible replacement

### Animation

- No prefers-reduced-motion support found
- Multiple transition: all anti-patterns
- Animations don't respect user motion preferences

### Performance

- Gallery may benefit from virtualization for large lists
- Countdown updates every second (consider throttling)
- Background-attachment: fixed may cause performance issues on mobile
- Isotope layout reads in useEffect (should batch)

### Typography

- Heading hierarchy issues (h6 used for person names)
- Text wrapping not verified for long content

### Images

- Slider images have generic alt text
- All images have proper dimensions ✓
- Loading strategies appropriate ✓

### Touch & Interaction

- touch-action: manipulation not verified
- -webkit-tap-highlight-color not set intentionally
- overscroll-behavior not checked for modals/drawers

### Responsive Design

- Safe area insets not verified for notches
- Overflow handling needs review

### Dark Mode

- color-scheme not set on html element
- Theme colors defined but dark mode support unclear

## Priority Recommendations

### Critical (Accessibility)

1. Add aria-labels to all icon-only buttons and links
2. Add aria-live to countdown timer
3. Add aria-pressed to filter buttons
4. Add skip link to main content
5. Fix focus states (add focus-visible:ring-\*)

### High (Performance & UX)

1. Add prefers-reduced-motion support to all animations
2. Replace transition: all with specific properties
3. Consider virtualization for large gallery lists
4. Fix background-attachment: fixed on mobile

### Medium (Code Quality)

1. Fix heading hierarchy (h6 → h2/h3 for person names)
2. Add proper aria associations for countdown items
3. Remove unnecessary preventDefault on buttons
4. Add keyboard navigation for filters
