import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-forest">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">AgriShield AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Kenya • East Africa</div>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#assistant">AI assistant</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/#contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-forest sm:inline-flex">Login</Link>
          <Link href="/register" className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800">Get Started</Link>
        </div>
      </div>
      <nav aria-label="Section navigation" className="flex gap-2 overflow-x-auto px-4 pb-3 text-sm font-medium text-slate-700 lg:hidden sm:px-6">
        <Link href="/#how-it-works" className="shrink-0 rounded-full px-3 py-2 hover:bg-emerald-50">How it works</Link>
        <Link href="/#solutions" className="shrink-0 rounded-full px-3 py-2 hover:bg-emerald-50">Solutions</Link>
        <Link href="/#assistant" className="shrink-0 rounded-full px-3 py-2 hover:bg-emerald-50">AI assistant</Link>
        <Link href="/#faq" className="shrink-0 rounded-full px-3 py-2 hover:bg-emerald-50">FAQ</Link>
        <Link href="/#contact" className="shrink-0 rounded-full px-3 py-2 hover:bg-emerald-50">Contact</Link>
      </nav>
    </header>
  );
}
