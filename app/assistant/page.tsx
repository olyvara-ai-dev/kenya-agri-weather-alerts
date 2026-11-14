import { MessageCircle } from 'lucide-react';
import { AssistantEmbed } from '@/components/assistant-embed';
import { DashboardShell } from '@/components/dashboard-shell';

export default function AssistantPage() {
  return (
    <DashboardShell title="AI farming assistant">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-800">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">AgriShield AI</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">How can we help your farm today?</h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Ask for weather-aware farming guidance without leaving your dashboard.
              </p>
            </div>
          </div>
        </div>
        <AssistantEmbed />
      </div>
    </DashboardShell>
  );
}
