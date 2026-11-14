import { BarChart3, BellRing, ShieldCheck, UserCog, Gauge, MapPinned } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { demoAdminMetrics, demoOrganizations } from '@/lib/demo-data';

export default function AdminPage() {
  return (
    <DashboardShell title="Platform administrator dashboard">
      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {demoAdminMetrics.map((item) => (
            <div key={item.label} className="card-surface rounded-3xl p-5">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-3 text-3xl font-black text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <Gauge className="h-5 w-5 text-emerald-700" />
              <div className="text-2xl font-black text-slate-900">System health</div>
            </div>
            <div className="space-y-4">
              {[
                ['Weather API', 'WeatherAPI / Open-Meteo fallback', 'Operational'],
                ['SMS sandbox', 'Africa\'s Talking test mode', 'Ready'],
                ['WhatsApp cloud', 'Demo mode', 'Ready'],
                ['Alert routing', 'Opt-in controls in place', 'Healthy'],
              ].map(([label, detail, status]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <div className="font-bold text-slate-900">{label}</div>
                    <div className="text-sm text-slate-500">{detail}</div>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <BellRing className="h-5 w-5 text-emerald-700" />
              <div className="text-2xl font-black text-slate-900">Recent activity</div>
            </div>
            <div className="space-y-3">
              {['Forecast job completed for 12,400 farms', 'High-risk alert generated in Nakuru', 'SMS sandbox message queued for 3 farmers', 'User permissions reviewed for 4 organizations'].map((activity) => (
                <div key={activity} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{activity}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <UserCog className="h-5 w-5 text-emerald-700" />
              <div className="text-2xl font-black text-slate-900">Organizations</div>
            </div>
            <div className="space-y-4">
              {demoOrganizations.map((org) => (
                <div key={org.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{org.name}</div>
                    <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">Active</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{org.members} members • {org.counties.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-emerald-700" />
              <div className="text-2xl font-black text-slate-900">High-risk locations</div>
            </div>
            <div className="space-y-3">
              {['Kakamega', 'Nakuru', 'Makueni', 'Kirinyaga'].map((place) => (
                <div key={place} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span>{place}</span>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Elevated risk
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
