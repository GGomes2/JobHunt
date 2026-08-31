# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Logo
**File:** `components/layout/Logo.tsx`
**Classes:**
- Container: `inline-flex items-center gap-2.5`
- Icon tile: `flex size-9 items-center justify-center rounded-[10px] bg-[linear-gradient(45deg,#7C5CFC_0%,#4A2EC5_100%)]`
- Wordmark: `text-[19px] font-bold leading-7 text-text-darkest`

### Navbar
**File:** `components/layout/Navbar.tsx`
**Classes:**
- Header: `sticky top-0 z-50 w-full border-b border-border bg-surface`
- Inner: `relative mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0`
- Nav: `order-3 flex w-full items-center justify-center gap-6 border-t border-border pt-3 md:absolute md:left-1/2 md:order-none md:w-auto md:-translate-x-1/2 md:border-0 md:pt-0`
- Nav links: `text-xs font-medium leading-4 text-text-dark hover:text-accent md:text-sm md:leading-5`; active link uses `text-accent`
- Primary CTA: `inline-flex items-center rounded-md bg-text-black px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90`

### Footer
**File:** `components/layout/Footer.tsx`
**Classes:**
- Footer: `w-full border-t border-border bg-surface`
- Inner: `mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center`
- Links: `text-sm font-medium text-text-secondary hover:text-text-primary`

### Hero
**File:** `components/homepage/Hero.tsx`
**Classes:**
- Section: `relative overflow-hidden bg-surface px-6 pb-16 pt-16 md:pb-24 md:pt-20`
- Headline: `text-[40px] font-bold leading-[1.15] tracking-tight text-text-primary md:text-[56px] md:leading-[1.1]`
- Subcopy: `mt-5 max-w-[560px] text-base font-medium leading-6 text-text-secondary md:text-lg md:leading-7`
- Primary button: `inline-flex items-center gap-2 rounded-md bg-text-black px-5 py-2.5 text-sm font-medium text-accent-foreground`
- Secondary button: `inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary`
- Preview frame: `overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_20px_50px_rgba(16,24,40,0.12)]`

### HowItWorks
**File:** `components/homepage/HowItWorks.tsx`
**Classes:**
- Section: `bg-surface px-6 py-20 md:py-28`
- Headline: `text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]`
- Feature icon wrap: `flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent`
- Feature title: `text-base font-semibold leading-6 text-text-primary`
- Feature body: `mt-1.5 text-sm font-medium leading-5 text-text-secondary`
- Image card: `overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`

### Features
**File:** `components/homepage/Features.tsx`
**Classes:**
- Section: `bg-surface px-6 py-20 md:py-28`
- Headline: `text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]`
- Feature icon wrap: `flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-lightest text-info-dark`
- Feature title: `text-base font-semibold leading-6 text-text-primary`
- Feature body: `mt-1.5 text-sm font-medium leading-5 text-text-secondary`
- Image card: `overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`

### LoginForm
File: `components/auth/LoginForm.tsx`
Last updated: 2026-08-13

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface`; error state uses `bg-accent-muted`; primary provider button uses `bg-text-black` |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl` for the auth card; `rounded-md` for buttons and inline alerts |
| Text — primary   | `text-text-primary`; provider primary button uses `text-accent-foreground` |
| Text — secondary | `text-text-secondary`; eyebrow uses `text-info-muted`; legal copy uses `text-text-muted` |
| Spacing          | `p-6`; content rhythm uses `mt-3`, `mt-5`, `mt-6`, `gap-3`; buttons use `px-4 py-2.5` |
| Hover state      | Secondary button uses `hover:bg-surface-secondary`; primary button uses `hover:opacity-90` |
| Shadow           | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Accent usage     | `text-accent`, `focus-visible:ring-accent`, `bg-accent-muted`, `text-info-muted` |

**Pattern notes:**
Auth cards should match the project card treatment: white surface, border token, `rounded-2xl`, `p-6`, and the standard card shadow. Provider actions use the same button split as the homepage CTAs: secondary button for Google, dark primary button for GitHub. Error states stay inside the card and use the accent-muted surface with human-readable text.

### Testimonial
**File:** `components/homepage/Testimonial.tsx`
**Classes:**
- Section: `relative overflow-hidden bg-surface-muted px-6 py-20 md:py-28`
- Eyebrow: `text-xs font-medium uppercase tracking-[0.14em] text-info-muted`
- Quote: `mt-6 text-[28px] font-semibold leading-9 tracking-tight text-text-primary md:text-[36px] md:leading-[1.25]`
- Avatar: `size-14 rounded-full border border-border object-cover`
- Name: `text-sm font-semibold leading-5 text-text-primary`
- Role: `text-xs font-normal leading-4 text-text-muted`

### BottomCta
**File:** `components/homepage/BottomCta.tsx`
**Classes:**
- Section: `relative overflow-hidden bg-surface px-6 py-20 md:py-28`
- Headline: `text-[32px] font-bold leading-10 tracking-tight text-text-primary md:text-[40px] md:leading-[1.15]`
- Subcopy: `mt-4 max-w-[480px] text-base font-medium leading-6 text-text-secondary`
- Primary / secondary buttons: same as Hero CTAs

### ProfileAttentionBanner

File: `components/profile/ProfileAttentionBanner.tsx`
Last updated: 2026-08-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`                                                          |
| Border           | `border border-border`                                                |
| Border radius    | `rounded-2xl`                                                         |
| Text — primary   | `text-text-primary`; alert icon uses `text-error`; complete icon uses `text-success` |
| Text — secondary | `text-text-secondary`; missing tags use `text-error`                  |
| Spacing          | `p-6`, `gap-6`, `mt-2`, `mt-4`, tag padding `px-2 py-0.5`             |
| Hover state      | None                                                                  |
| Shadow           | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Accent usage     | Missing tags use `bg-accent-muted`; incomplete ring uses error + accent-light; complete ring uses success |

**Pattern notes:**
Profile status cards match the standard white card treatment, then place urgency inside the card via tokenized error text and accent-muted tags. Completion rings use a `--completion` CSS variable with tokenized conic-gradient utilities.

### ResumeUpload

File: `components/profile/ResumeUpload.tsx`
Last updated: 2026-08-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | Card uses `bg-surface`; dropzone uses `bg-surface-secondary`          |
| Border           | `border border-border`                                                |
| Border radius    | Card `rounded-2xl`; dropzone `rounded-xl`; buttons `rounded-md`       |
| Text — primary   | `text-text-primary`; primary CTA uses `text-accent-foreground`        |
| Text — secondary | `text-text-muted`; errors use `text-error`                            |
| Spacing          | Card `p-6`; dropzone `px-6 py-8`; button `px-4 py-2`; content `mt-5`  |
| Hover state      | Secondary button `hover:bg-surface-secondary`; primary `hover:bg-accent-dark` |
| Shadow           | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Accent usage     | Upload icon uses `bg-accent-muted text-accent`; primary CTA `bg-accent` |

**Pattern notes:**
Resume upload cards use a secondary-surface dropzone inside the standard card. Feature 06 adds PDF validation, drag-and-drop, and browser upload without changing the visual shell. Generate Resume stays a no-op until Feature 08.

### ProfileForm

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-08-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`; nested work card uses `bg-surface-secondary`            |
| Border           | `border border-border`; section divider uses `border-t border-border` |
| Border radius    | Card `rounded-2xl`; inputs/buttons `rounded-md`; nested work card `rounded-xl` |
| Text — primary   | `text-text-primary`                                                   |
| Text — secondary | Labels use `text-text-secondary`; helper/muted text uses `text-text-muted` |
| Spacing          | Card `p-6`; form `mt-6 pt-6`; sections `mt-10`; grids `gap-4`; inputs `px-3 py-2` |
| Hover state      | Secondary buttons `hover:bg-surface-secondary`; primary `hover:bg-accent-dark` |
| Shadow           | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Accent usage     | Focus `focus:border-accent focus:ring-accent`; links/buttons use `text-accent` and `bg-accent` |

**Pattern notes:**
Profile forms use uppercase tokenized labels, two-column desktop grids, and full-width mobile stacking. Inputs remain white even inside secondary nested panels, matching the screenshot and the form token rules. Success save copy uses `bg-success-lightest text-success-foreground`; save errors use `bg-accent-muted text-accent`.
