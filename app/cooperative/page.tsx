import { DashboardShell } from '@/components/dashboard-shell';
import { MapFrame } from '@/components/map-frame';
import { demoFarms, demoOrganizations } from '@/lib/demo-data';

export default function CooperativePage() {
  return (
    <DashboardShell title="Cooperative operations">
      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-3">
          {demoOrganizations.map((org) => (
            <div key={org.id} className="card-surface rounded-3xl p-5">
              <div className="text-sm text-slate-500">Organization</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{org.name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 p-3">Members: {org.members}</div>
                <div className="rounded-xl bg-slate-50 p-3">Risk zones: {org.riskZones}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 text-2xl font-black text-slate-900">Geospatial overview</div>
            <MapFrame farms={demoFarms} />
          </div>

          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 text-2xl font-black text-slate-900">Risk summary</div>
            <div className="space-y-4">
              {demoFarms.map((farm) => (
                <div key={farm.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{farm.name}</div>
                    <span className={`badge status-${farm.risk}`}>{farm.risk}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{farm.county}</div>
                  <div className="mt-2 text-sm text-slate-700">Crop: {farm.crop}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
