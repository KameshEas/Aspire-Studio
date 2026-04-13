Design System — Intelligence Layer

This file documents the design tokens and how to use them across the frontend.

Tokens (CSS variables)
- Colors are defined in `components/tokens.css` and exposed as CSS variables (e.g. `--brand-500`, `--neutral-50`, `--surface-1`).
- Backwards-compatible variables used by the codebase are also set (e.g. `--color-bg`, `--color-text`, `--color-surface-1`).

Tailwind
- `tailwind.config.js` maps useful token names to CSS variables. Use `bg-primary` or `text-brand-500` in Tailwind classes.
- Spacing, radius and boxShadow tokens are available via `theme.extend` (e.g. `p-md`, `rounded-lg`, `shadow-md`).

Utilities provided
- `.brand-gradient` — shorthand class for the signature indigo→violet gradient.
- `.brand-text-gradient` — gradient applied to text.
- `.glass-panel` — glassmorphism panel (backdrop blur + indigo ambient shadow).

Logo assets
- Place logo sources in `public/logo/`.
- Files added: `aspire-logo-mark.svg`, `aspire-logo-wordmark.svg`.

How to apply
- Keep global tokens in `components/tokens.css`. `app/globals.css` already imports these tokens.
- Prefer Tailwind utilities when composing UI. Use CSS variables for one-off styles and dynamic theming.
- Primary CTA: use `bg-gradient-to-br from-[var(--brand-gradient-start)] to-[var(--brand-gradient-end)]` or the `.brand-gradient` helper.

Examples
- Use the full lockup:
  <img src="/logo/aspire-logo-wordmark.svg" alt="Aspire Studio" />

- Use the mark:
  <img src="/logo/aspire-logo-mark.svg" alt="Aspire Studio" />

- Button using the gradient:
  <button class="w-full py-3 px-4 bg-gradient-to-br from-brand-500 to-brand-400 text-white rounded-lg">Continue</button>

Notes
- If you need to change tokens globally, edit `components/tokens.css`.
- After editing `tailwind.config.js`, rebuild the dev server so Tailwind picks up the changes.
