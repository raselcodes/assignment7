#!/usr/bin/env bash
# Run once after `npm install` to create 10 meaningful commits.
set -e
git init -q 2>/dev/null || true
c() { git add "${@:2}" && git commit -q -m "$1" && echo "committed: $1"; }

c "chore: initialize Next.js project with Tailwind and DaisyUI" package.json tsconfig.json next.config.mjs postcss.config.mjs .gitignore .env.example src/app/globals.css
c "feat: add Bengali number, price and date helpers" src/lib/bn.ts
c "feat: add API layer with fallback URL and data normalizers" src/lib/api.ts
c "feat: add navbar, price ticker and footer" src/components/Navbar.tsx src/components/Ticker.tsx src/components/Footer.tsx src/components/Thumb.tsx src/app/layout.tsx
c "feat: build hero, product cards and home sections with skeletons" src/components/Hero.tsx src/components/ProductCard.tsx src/components/ProductGrid.tsx src/components/Skeletons.tsx src/app/page.tsx
c "feat: add category page with numeric sort and empty state" src/components/CategoryProducts.tsx src/components/NotFoundView.tsx src/app/category src/app/not-found.tsx
c "feat: configure BetterAuth with MongoDB, Google and GitHub" src/lib/auth.ts src/lib/auth-client.ts src/lib/session.ts src/app/api
c "feat: add sign in and sign up pages with toasts" src/components/AuthShell.tsx src/components/SocialButtons.tsx src/components/SignInForm.tsx src/components/SignUpForm.tsx src/app/signin src/app/signup
c "feat: add protected product details page" src/app/product
c "feat: add profile and update name pages, write README" src/components/UpdateProfileForm.tsx src/app/profile README.md scripts
