import React, { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import {
  AREA_HOTSPOTS_DEMO,
  MONTHLY_TREND_DEMO,
} from '../data/mockComplaints';
import { CivicComplaint } from '../types/civic';

interface CommunityInsightsPageProps {
  complaints: CivicComplaint[];
  onInspectComplaint: (id: string) => void;
}

export const CommunityInsightsPage: React.FC<CommunityInsightsPageProps> = ({
  complaints,
  onInspectComplaint,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedHotspotCategory, setSelectedHotspotCategory] = useState<
    'Potholes' | 'All'
  >('Potholes');

  const liveCounts = useMemo(() => {
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const pending = complaints.length - resolved;
    const byCategory: Record<string, number> = {};
    complaints.forEach((c) => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });
    return {
      total: complaints.length,
      resolved,
      pending,
      byCategory,
    };
  }, [complaints]);

  // Combine demonstration 6-month baseline with live session count delta
  const baselineTotal = 1045;
  const displayTotal = baselineTotal + complaints.length;
  const displayResolved = 860 + liveCounts.resolved;
  const displayPending = displayTotal - displayResolved;
  const resolvedPercent = Math.round((displayResolved / displayTotal) * 100);

  const categoryChartData = useMemo(() => {
    const base: Record<string, number> = {
      Pothole: 312,
      'Overflowing Garbage': 248,
      'Damaged Road': 164,
      'Water Leakage': 129,
      'Broken Streetlight': 118,
      'Damaged Sidewalk': 96,
      'Drainage Blockage': 78,
    };
    return Object.entries(base)
      .map(([name, sampleCount]) => ({
        name,
        count: sampleCount + (liveCounts.byCategory[name] || 0),
      }))
      .sort((a, b) => b.count - a.count);
  }, [liveCounts.byCategory]);

  const maxCategoryCount = Math.max(...categoryChartData.map((d) => d.count));

  const potholeComplaints = useMemo(
    () =>
      complaints.filter((c) =>
        selectedHotspotCategory === 'Potholes'
          ? c.category === 'Pothole' || c.category === 'Damaged Road'
          : true
      ),
    [complaints, selectedHotspotCategory]
  );

  // SVG chart scaling for monthly trend
  const maxTrend = 240;
  const chartHeight = 190;

  return (
    <div className="space-y-6">
      {/* Explicit Demonstration Data Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-[#0F2942]">
            Demonstration Analytics Dataset:
          </strong>{' '}
          Historical 6-month volumes and ward distributions represent sample
          municipal demonstration data combined with your{' '}
          <span className="font-mono font-semibold text-[#0F2942] tabular-nums">
            {complaints.length}
          </span>{' '}
          live session reports.
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Total Reported Issues
          </p>
          <p className="text-2xl font-display font-bold text-[#0F2942] tabular-nums mt-1">
            {displayTotal.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Sample 6-mo + live reports
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Resolved vs. Pending
          </p>
          <p className="text-2xl font-display font-bold text-[#059669] tabular-nums mt-1">
            {resolvedPercent}%
          </p>
          <p className="text-xs text-slate-500 tabular-nums mt-1">
            {displayResolved} resolved · {displayPending} pending
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Top Issue Category
          </p>
          <p className="text-2xl font-display font-bold text-[#0F2942] mt-1">
            Potholes
          </p>
          <p className="text-xs text-slate-500 tabular-nums mt-1">
            {categoryChartData[0].count} total road cavity cases
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Highest Density Ward
          </p>
          <p className="text-2xl font-display font-bold text-[#0D9488] mt-1">
            Downtown Core
          </p>
          <p className="text-xs text-slate-500 tabular-nums mt-1">
            48 pothole reports in sample
          </p>
        </div>
      </div>

      {/* Charts Row: Monthly Trends + Resolved vs Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Report Trends */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-display font-semibold text-[#0F2942]">
                Monthly Report Trends (Demonstration)
              </h2>
              <p className="text-xs text-slate-500">
                Comparison of submitted complaints vs. completed field repairs
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0F2942] inline-block" />
                <span>Reported</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0D9488] inline-block" />
                <span>Resolved</span>
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-6 gap-3 items-end h-[210px] pt-6 border-b border-slate-200 pb-2">
              {MONTHLY_TREND_DEMO.map((d, idx) => {
                const reportedH = Math.round((d.reported / maxTrend) * chartHeight);
                const resolvedH = Math.round((d.resolved / maxTrend) * chartHeight);
                const isHovered = hoveredMonth === idx;
                return (
                  <div
                    key={d.month}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {isHovered && (
                      <div className="absolute -top-2 z-10 bg-[#0F2942] text-white text-[11px] rounded-md px-2.5 py-1 shadow-md whitespace-nowrap tabular-nums">
                        {d.month}: {d.reported} reported · {d.resolved} resolved
                      </div>
                    )}
                    <div className="flex items-end gap-1.5 w-full justify-center">
                      <div
                        className="w-4 sm:w-5 bg-[#0F2942] rounded-t-sm transition-opacity group-hover:opacity-90"
                        style={{ height: `${reportedH}px` }}
                      />
                      <div
                        className="w-4 sm:w-5 bg-[#0D9488] rounded-t-sm transition-opacity group-hover:opacity-90"
                        style={{ height: `${resolvedH}px` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-6 gap-3 pt-2 text-center text-xs font-medium text-slate-600">
              {MONTHLY_TREND_DEMO.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Resolved vs Pending Split */}
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-display font-semibold text-[#0F2942]">
              Resolution Balance
            </h2>
            <p className="text-xs text-slate-500">
              Resolved vs. open &amp; in-progress backlog
            </p>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="14"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="14"
                  strokeDasharray={`${(resolvedPercent / 100) * 301.59} 301.59`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-bold text-[#0F2942] tabular-nums">
                  {resolvedPercent}%
                </span>
                <span className="text-[11px] text-slate-500">Resolved</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Resolved Reports</span>
              <span className="font-mono font-semibold text-[#059669] tabular-nums">
                {displayResolved.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Pending / In Progress</span>
              <span className="font-mono font-semibold text-amber-700 tabular-nums">
                {displayPending.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Category Breakdown + Area Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Common Issue Categories */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-base font-display font-semibold text-[#0F2942]">
            Most Common Issue Categories
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Distribution across infrastructure &amp; sanitation reports
          </p>

          <div className="space-y-4">
            {categoryChartData.map((cat) => {
              const pct = Math.round((cat.count / maxCategoryCount) * 100);
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">
                      {cat.name}
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {cat.count}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F2942] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reports by Area Table */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 pb-4 border-b border-slate-200">
            <h2 className="text-base font-display font-semibold text-[#0F2942]">
              Reports by District Area (Sample Data)
            </h2>
            <p className="text-xs text-slate-500">
              Volume breakdown by issue type and ward resolution efficiency
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                  <th className="py-3 px-5">Area / Ward</th>
                  <th className="py-3 px-4 text-right">Potholes</th>
                  <th className="py-3 px-4 text-right">Sanitation</th>
                  <th className="py-3 px-4 text-right">Utilities</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-5 text-right">Resolved %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {AREA_HOTSPOTS_DEMO.map((row) => (
                  <tr key={row.area} className="hover:bg-slate-50">
                    <td className="py-3 px-5 font-semibold text-[#0F2942]">
                      {row.area}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-red-700 font-semibold">
                      {row.potholes}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-600">
                      {row.sanitation}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-600">
                      {row.utilities}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums font-semibold text-slate-900">
                      {row.total}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-xs tabular-nums text-emerald-700 font-semibold">
                      {row.resolutionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Pothole Hotspot Visualization */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-display font-semibold text-[#0F2942]">
              Pothole &amp; Road Damage Hotspot Visualization
            </h2>
            <p className="text-xs text-slate-500">
              Corridor concentration analysis for preventive asphalt resurfacing
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setSelectedHotspotCategory('Potholes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                selectedHotspotCategory === 'Potholes'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Potholes &amp; Roads
            </button>
            <button
              type="button"
              onClick={() => setSelectedHotspotCategory('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                selectedHotspotCategory === 'All'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              All Categories
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 min-h-[320px]">
            <CivicLeafletMap
              complaints={potholeComplaints}
              onInspectComplaint={onInspectComplaint}
              heightClass="h-full min-h-[320px]"
              zoom={13}
              showLegend={true}
              showControls={true}
            />
          </div>

          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Top Priority Road Corridors (Sample)
            </p>
            {[
              {
                corridor: '4th Ave & Pike St Transit Corridor',
                ward: 'Downtown Core',
                density: 'High Concentration',
                reports: 19,
                pct: 92,
              },
              {
                corridor: 'Denny Way & Stewart St Junction',
                ward: 'Denny Triangle',
                density: 'Elevated Cluster',
                reports: 14,
                pct: 74,
              },
              {
                corridor: 'Westlake Ave N Cycle Track',
                ward: 'South Lake Union',
                density: 'Moderate Cluster',
                reports: 9,
                pct: 52,
              },
              {
                corridor: 'Broadway & E Pine St Crossing',
                ward: 'Capitol Hill',
                density: 'Moderate Cluster',
                reports: 8,
                pct: 46,
              },
            ].map((cor) => (
              <div
                key={cor.corridor}
                className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/60 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0F2942]">
                      {cor.corridor}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cor.ward} · {cor.density}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-red-700 tabular-nums shrink-0">
                    {cor.reports} reports
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${cor.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
