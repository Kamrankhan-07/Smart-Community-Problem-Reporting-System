import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { AppView, CivicComplaint } from '../types/civic';
import { formatShortDate } from '../utils/geo';

interface AdminDashboardPageProps {
  complaints: CivicComplaint[];
  onNavigate: (view: AppView) => void;
  onManageComplaint: (id: string) => void;
  onInspectComplaint: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  complaints,
  onNavigate,
  onManageComplaint,
  onInspectComplaint,
}) => {
  const total = complaints.length;
  const newCount = complaints.filter((c) => c.status === 'New').length;
  const reviewCount = complaints.filter((c) => c.status === 'Under Review').length;
  const progressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const priorityIssues = complaints
    .filter((c) => c.priority === 'High' && c.status !== 'Resolved' && c.status !== 'Duplicate')
    .slice(0, 4);

  const recentReports = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#0D9488] mb-1">
            Municipal Operations &amp; Dispatch
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0F2942] tracking-tight">
            Administrator Overview
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor incoming citizen reports, triage urgent street hazards, and
            coordinate crew assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('admin-management')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Open Complaint Manager</span>
        </button>
      </div>

      {/* 5-Column Admin KPI Strip */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Total Complaints</p>
          <p className="text-2xl font-display font-bold text-[#0F2942] tabular-nums mt-1">
            {total}
          </p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">New Reports</p>
          <p className="text-2xl font-display font-bold text-rose-600 tabular-nums mt-1">
            {newCount}
          </p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Under Review</p>
          <p className="text-2xl font-display font-bold text-amber-600 tabular-nums mt-1">
            {reviewCount}
          </p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">In Progress</p>
          <p className="text-2xl font-display font-bold text-[#0D9488] tabular-nums mt-1">
            {progressCount}
          </p>
        </div>
        <div className="p-5 col-span-2 md:col-span-1">
          <p className="text-xs font-medium text-slate-500">Resolved</p>
          <p className="text-2xl font-display font-bold text-emerald-600 tabular-nums mt-1">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Priority Issues + Map Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* High Priority Issues */}
        <section className="xl:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <h3 className="text-base font-display font-semibold text-[#0F2942]">
                  High-Priority Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Unresolved hazards flagged for expedited crew dispatch
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-management')}
              className="text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] cursor-pointer"
            >
              Manage all
            </button>
          </div>

          {priorityIssues.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              All high-priority issues have been resolved.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1">
              {priorityIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CivicImage
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-14 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-mono">{issue.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{issue.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {issue.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {issue.address} ({issue.neighborhood})
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusIndicator status={issue.status} />
                    <button
                      type="button"
                      onClick={() => onManageComplaint(issue.id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-md transition-colors cursor-pointer"
                    >
                      Triage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Map Overview */}
        <section className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                District Operations Map
              </h3>
              <p className="text-xs text-slate-500">
                Click any marker to inspect or triage directly
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('community-map')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] cursor-pointer"
            >
              <span>Expand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-h-[300px]">
            <CivicLeafletMap
              complaints={complaints}
              onInspectComplaint={onManageComplaint}
              heightClass="h-full min-h-[300px]"
              zoom={13}
              showLegend={true}
              showControls={true}
            />
          </div>
        </section>
      </div>

      {/* Recent Reports & Management Quick Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-semibold text-[#0F2942]">
              Recent Incoming Reports
            </h3>
            <p className="text-xs text-slate-500">
              Latest submissions across all municipal wards
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admin-management')}
            className="text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] cursor-pointer"
          >
            View full queue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentReports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 truncate max-w-[200px]">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    <p className="truncate max-w-[180px]">{item.address}</p>
                    <p className="text-slate-500">{item.neighborhood}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                    {item.reporterName}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                    {formatShortDate(item.reportedAt)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityIndicator priority={item.priority} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusIndicator status={item.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectComplaint(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-[#0F2942] cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onManageComplaint(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-md cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
