import Link from 'next/link';
import { ArrowRight, CloudRain, MapPin, ShieldCheck, Smartphone, TrendingUp, Users, CheckCircle2, CloudSun, MessageCircle } from 'lucide-react';
import { AssistantEmbed } from '@/components/assistant-embed';
import { SiteHeader } from '@/components/site-header';

const features = [
  { title: 'Hyperlocal weather intelligence', description: 'Forecasts tuned to each field, cooperative network and county risk profile.', icon: MapPin },
  { title: 'Actionable 24-hour warnings', description: 'Know exactly when to plant, spray, harvest and protect stored crops.', icon: CloudRain },
  { title: 'Regional risk visibility', description: 'Track rainfall risk hotspots across farms, counties and organizations.', icon: TrendingUp },
];

const stats = [
  { label: 'Active farms monitored', value: '12.4K' },
  { label: 'Farmers protected', value: '89%' },
  { label: 'Average reduction in weather-related losses', value: '34%' },
];

const solutions = [
  'Farmers get plain-language guidance in English and Kiswahili.',
  'Cooperatives monitor risk clusters and coordinate response.',
  'Agro-dealers spot high-risk requests and inventory needs.',
  'Organizations manage alerts, opt-ins and delivery logs from one place.',
];

const faqs = [
  { q: 'How accurate is the forecast?', a: 'AgriShield combines live weather forecasts with transparent risk rules, making uncertainty explicit and reviewable.' },
  { q: 'Can we use SMS and WhatsApp?', a: 'Yes. The platform supports both SMS and WhatsApp delivery with demo mode and production-safe controls.' },
  { q: 'Is this built for Kenya?', a: 'Yes — the MVP is focused on Kenya with a clear path to East Africa and broader African markets.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f8f5] text-slate-800">
      <SiteHeader />

      <section className="bg-hero overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Built for farms across Kenya
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Make every farm decision with confidence.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Local weather intelligence and practical crop guidance to help farmers, cooperatives and agribusinesses prepare for what comes next.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#assistant" className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white/80 px-6 py-3.5 font-semibold text-forest transition hover:border-emerald-700 hover:bg-white">
                <MessageCircle className="h-4 w-4" /> Ask the AI assistant
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white bg-white/75 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
                  <div className="text-2xl font-black text-forest">{item.value}</div>
                  <div className="mt-1.5 text-xs leading-5 text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 text-white shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Field weather snapshot</div>
                  <div className="mt-3 text-3xl font-black">Moderate rain</div>
                  <div className="mt-1 text-sm text-slate-300">Plan ahead for the next 24 hours</div>
                </div>
                <div className="rounded-2xl bg-amber-400/15 p-3.5 text-amber-300 ring-1 ring-amber-300/20">
                  <CloudSun className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Rain</div>
                  <div className="mt-2 text-2xl font-bold">18mm</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Probability</div>
                  <div className="mt-2 text-2xl font-bold">72%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Humidity</div>
                  <div className="mt-2 text-2xl font-bold">83%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Wind</div>
                  <div className="mt-2 text-2xl font-bold">18 km/h</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Farm advisory</div>
                Delay fertilizer application and protect harvested maize ahead of the rain.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">How AgriShield works</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">From forecast to farm action in minutes</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }, index) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 text-lg font-bold text-slate-900">0{index + 1} • {title}</div>
              <p className="mt-3 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="scroll-mt-28 bg-slate-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Built for agriculture</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">One platform for every farm ecosystem</h2>
            <div className="mt-8 space-y-4">
              {solutions.map((item) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                  <div className="text-slate-200">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Users className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-xl font-bold">For farmers</h3>
              <p className="mt-2 text-sm text-slate-300">Personalized alerts, field-specific recommendations and multilingual guidance.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <CloudRain className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-xl font-bold">For cooperatives</h3>
              <p className="mt-2 text-sm text-slate-300">Manage groups, monitor county risk and send tailored advisories from one dashboard.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <TrendingUp className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-xl font-bold">For agribusiness</h3>
              <p className="mt-2 text-sm text-slate-300">Track crop exposure, high-risk zones and operational planning by region.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Smartphone className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-xl font-bold">SMS + WhatsApp</h3>
              <p className="mt-2 text-sm text-slate-300">Deliver alerts where farmers already communicate and at the right moment.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="assistant" className="scroll-mt-28 bg-emerald-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AgriShield AI</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">Ask our farming assistant</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Get help with weather-aware farming decisions from the AgriShield AI assistant.
            </p>
          </div>
          <AssistantEmbed />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Everything you need to know</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-lg font-bold text-slate-900">{item.q}</div>
              <p className="mt-3 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="scroll-mt-28 bg-emerald-50 py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 text-center shadow-soft sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Contact</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Ready to protect every harvest?</h2>
          <p className="mt-4 text-slate-600">Build resilient farm planning with weather intelligence for Kenya and East Africa.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="rounded-full bg-forest px-6 py-3 font-semibold text-white">Request a demo</Link>
            <a href="mailto:hello@agrishield.ai" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700">hello@agrishield.ai</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>AgriShield AI · Weather guidance for farm planning. Verify forecasts and local conditions before acting.</p>
          <nav aria-label="Legal" className="flex gap-5 font-medium">
            <Link href="/privacy-policy" className="transition hover:text-forest">Privacy</Link>
            <Link href="/terms" className="transition hover:text-forest">Terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
