import Link from 'next/link';
import { Bell, ShieldCheck, MapPinned, Activity, LayoutDashboard, MessageCircle } from 'lucide-react';
import { SignOutButton } from '@/components/sign-out-button';

export function DashboardShell({ children, title }:{ children: React.ReactNode; title:string }) {
  return (
    <div className="dashboard-shell min-h-screen text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-slate-950 text-white lg:block">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-black">AgriShield AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Farmer command center</div>
          </div>
        </div>

        <nav className="space-y-2 p-5 text-sm">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-white/5 p-3 font-medium text-slate-100"><LayoutDashboard className="h-4 w-4"/>Dashboard</Link>
          <Link href="/dashboard#alerts" className="flex items-center gap-3 rounded-xl p-3 text-slate-300 hover:bg-white/5"><Bell className="h-4 w-4"/>Alerts</Link>
          <Link href="/cooperative" className="flex items-center gap-3 rounded-xl p-3 text-slate-300 hover:bg-white/5"><MapPinned className="h-4 w-4"/>Cooperative view</Link>
          <Link href="/admin" className="flex items-center gap-3 rounded-xl p-3 text-slate-300 hover:bg-white/5"><Activity className="h-4 w-4"/>Admin console</Link>
          <Link href="/assistant" className="flex items-center gap-3 rounded-xl p-3 text-slate-300 hover:bg-white/5"><MessageCircle className="h-4 w-4"/>AI farming assistant</Link>
          <SignOutButton className="mt-6 flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-slate-300 hover:bg-white/5" />
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">AgriShield dashboard</div>
              <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <SignOutButton className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" />
            </div>
          </div>
          <nav aria-label="Dashboard navigation" className="flex items-center gap-2 overflow-x-auto px-4 pb-4 lg:hidden sm:px-6">
            <Link href="/dashboard" className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
            <Link href="/dashboard#alerts" className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><Bell className="h-4 w-4" />Alerts</Link>
            <Link href="/cooperative" className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><MapPinned className="h-4 w-4" />Cooperative</Link>
            <Link href="/admin" className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><Activity className="h-4 w-4" />Admin</Link>
            <Link href="/assistant" className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><MessageCircle className="h-4 w-4" />AI assistant</Link>
            <SignOutButton className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" />
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
