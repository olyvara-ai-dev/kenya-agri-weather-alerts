export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
      <div className="mt-8 space-y-5 text-slate-700">
        <p>AgriShield AI uses Supabase Authentication to manage account sign-in and stores each account&apos;s name, access role and preferred language, together with its farm profile, in Supabase. Row-level security is used to restrict farm-profile access to the signed-in account. Account registration requires an email address and password; password handling is managed by Supabase.</p>
        <p>When you request a forecast, your farm coordinates are sent to the AgriShield server and forwarded to WeatherAPI when configured, or Open-Meteo otherwise. Map tiles are requested from Esri. These providers handle requests under their own privacy policies.</p>
        <p>If you use the AI assistant, messages are processed by Udify. Do not include passwords, financial details, or other sensitive personal information in chat messages.</p>
        <p>Farm profiles are stored in the configured Supabase project and are available across devices after sign-in. Contact the service operator to request account or data deletion; the app does not currently provide a self-service account deletion feature.</p>
        <p>Email alerts are not currently sent. SMS and WhatsApp notifications are demonstration-only and do not deliver real messages.</p>
        <p>This notice describes the app&apos;s current intended data flows and is not a substitute for a reviewed privacy policy. The operator should confirm retention periods, provider terms and applicable legal obligations before production use.</p>
      </div>
    </main>
  );
}
