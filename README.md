# AgriShield AI

A Next.js app for Kenyan farmers, with weather forecasts, farm profiles, crop-aware guidance, a satellite map, and an embedded AI assistant. Supabase provides authentication and per-user farm-profile storage.

## Run locally

Requirements: Node.js 20 or newer, npm, and a Supabase project.

```bash
npm ci
cp -n .env.example .env.local
npm run dev
```

Configure `.env.local` with the Supabase project URL and anon/publishable key. These are public client configuration values; never put a Supabase service-role key in the app.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WEATHER_API_KEY=
```

Set `NEXT_PUBLIC_SITE_URL` to the URL users open in their browser. This controls email-verification links; in Codespaces, use the forwarded port URL instead of `localhost`. In the Supabase SQL Editor, run [`supabase/migrations/20261113150000_create_profiles_and_farms.sql`](./supabase/migrations/20261113150000_create_profiles_and_farms.sql). In **Authentication → URL Configuration**, set the Site URL to the same origin and add `<site-url>/auth/callback` to the redirect URL allow list. Configure the matching production URLs before deployment. Email confirmation can be enabled in the Supabase Auth settings; the app handles the verification callback.

Set `WEATHER_API_KEY` to use WeatherAPI. Keep it server-side; do not prefix it with `NEXT_PUBLIC_`. If it is unset, forecasts use Open-Meteo.

Useful checks:

```bash
npm test
npm run lint
npm run build
npm start
```

## Deploy

Netlify supports this app's Next.js App Router, server rendering, route handlers, and middleware with its automatic Next.js adapter. No `netlify.toml` or extra adapter dependency is required.

1. In Netlify, choose **Add new site → Import an existing project** and select `olyvara-ai-dev/kenya-agri-weather-alerts` from GitHub. Keep the detected Next.js build settings.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Netlify environment variables. Add `WEATHER_API_KEY` as a server-side variable if using WeatherAPI.
3. After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the assigned Netlify site URL and redeploy. Never put secrets in source control or `NEXT_PUBLIC_*` variables.
4. In Supabase Auth URL Configuration, set the Site URL to the Netlify site URL and add `<netlify-site-url>/auth/callback` to the redirect URL allow list.
5. Verify registration, email verification, sign-in/sign-out, farm-profile persistence, `/assistant`, and `/api/weather?lat=-0.8&lon=37.3`.

See the [Netlify Next.js deployment guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/). The app also works without the WeatherAPI key through its Open-Meteo fallback.

## Access and data

- Public sign-ups receive the `farmer` role. Administrative roles must be assigned by an authorized operator using the Supabase SQL Editor; never grant role changes to browser clients.
- Row-level security restricts farm profiles to their authenticated owner. Keep the migration and RLS policies enabled.
- The app does not send email, SMS, or WhatsApp alerts. Notification cards are demonstrations only; do not advertise delivery until a real provider, consent, unsubscribe, and delivery monitoring are implemented.
- Review the privacy notice and terms with appropriate legal counsel for the actual data practices and jurisdictions.
- Review rate limits and provider quotas for public forecast requests.
- Confirm usage terms for external services: WeatherAPI/Open-Meteo, Esri imagery, and the Udify-hosted assistant.

The current privacy notice and terms describe demo behavior and are not production legal documents.
