🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে। BazarDor shows today's market prices for everyday goods in Bangladesh, with Bengali numerals, daily price changes and market-wise comparisons.

Live: add your link · Repo: \_add your link
Technologies

- Next.js (App Router) and TypeScript
- Tailwind CSS v4 and DaisyUI 5
- BetterAuth (email/password, Google, GitHub) with MongoDB
- react-hot-toast
- Hosted on Vercel

Key features

1. Live price ticker: an infinite, pause-on-hover marquee with emoji, price per unit and a ▲/▼ change badge.
2. Risers and fallers: the top 6 products whose price rose and fell today, plus a full product grid.
3. Bengali-first: Bengali digits, Bangla date in the navbar, and numeric (not string) price sorting.
4. Category pages: sort by default, low to high or high to low; skeleton loading and a friendly empty/404 state.
5. Protected product details: min, max and average price plus market-wise prices, visible only after sign in.
6. Authentication: email/password, Google and GitHub sign in, toasts for every outcome, profile page and name update.
7. Responsive: mobile, tablet and desktop layouts, including a scrollable category row on small screens.

Getting started

bash
npm install
cp .env.example .env.local # fill in the values
npm run dev

Open http://localhost:3000.

### Environment variables

See `.env.example`. You need a MongoDB Atlas connection string (allow `0.0.0.0/0` under Network Access for Vercel) and a long random `BETTER_AUTH_SECRET`. Google and GitHub keys are optional; the buttons show an error toast until you add them.

OAuth callback URLs:

- `http://localhost:3000/api/auth/callback/google` and `/github`
- `https://YOUR-DOMAIN/api/auth/callback/google` and `/github`

### Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add every variable from `.env.example`, setting `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL.
3. Deploy. Dynamic routes (`/category/[slug]`, `/product/[slug]`) are server-rendered, so refreshing never gives a hard 404.

## If the API fields differ

The API field names are not documented, so `src/lib/api.ts` reads each value from several likely keys (for example `price`, `todayPrice`, `change`, `changePercent`). Open `/products` and `/products/1` in your browser; if a key differs, add it to the matching list in `normalizeProduct`.
