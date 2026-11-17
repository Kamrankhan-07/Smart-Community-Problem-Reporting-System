import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FilePlus2,
  MapPin,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { AppView, CivicComplaint, UserProfile } from '../types/civic';
import { formatDateTime, formatShortDate } from '../utils/geo';

interface CitizenDashboardProps {
  userProfile: UserProfile;
  complaints: CivicComplaint[];
  onNavigate: (view: AppView) => void;
  onInspectComplaint: (id: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  userProfile,
  complaints,
  onNavigate,
  onInspectComplaint,
}) => {
  const myComplaints = complaints.filter((c) => c.isOwnReport);
  const totalCount = myComplaints.length;
  const pendingCount = myComplaints.filter(
    (c) => c.status === 'New' || c.status === 'Under Review'
  ).length;
  const inProgressCount = myComplaints.filter(
    (c) => c.status === 'In Progress'
  ).length;
  const resolvedCount = myComplaints.filter(
    (c) => c.status === 'Resolved'
  ).length;

  const nearbyIssues = complaints
    .filter((c) => !c.isOwnReport && c.status !== 'Resolved')
    .slice(0, 4);

  const recentActivity = complaints
    .flatMap((c) =>
      c.timeline.map((ev) => ({
        ...ev,
        complaintId: c.id,
        category: c.category,
        address: c.address,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#0D9488] mb-1">
            {userProfile.neighborhood}
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0F2942] tracking-tight">
            Welcome back, {userProfile.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Track your submitted civic reports, inspect nearby street issues, or
            submit a new photo report.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('report-issue')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Total Reports</p>
          <p className="text-2xl font-display font-bold text-[#0F2942] tabular-nums mt-1">
            {totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Your submitted cases</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-600 tabular-nums mt-1">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Awaiting crew assignment</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">In Progress</p>
          <p className="text-2xl font-display font-bold text-[#0D9488] tabular-nums mt-1">
            {inProgressCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Active field dispatch</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">Resolved</p>
          <p className="text-2xl font-display font-bold text-[#059669] tabular-nums mt-1">
            {resolvedCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Completed &amp; verified</p>
        </div>
      </div>

      {/* Main Grid: Recent Complaints + Map Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Complaints */}
        <section className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                Your Recent Complaints
              </h3>
              <p className="text-xs text-slate-500">
                Click any report to view status timeline and administrator remarks
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('my-reports')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] whitespace-nowrap cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                No complaints submitted yet
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Start by uploading a photo of an infrastructure issue in your neighborhood.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('report-issue')}
                className="px-4 py-2 text-xs font-semibold bg-[#0F2942] text-white rounded-lg cursor-pointer"
              >
                Submit First Report
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myComplaints.slice(0, 4).map((complaint) => (
                <button
                  key={complaint.id}
                  type="button"
                  onClick={() => onInspectComplaint(complaint.id)}
                  className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 cursor-pointer"
                >
                  <CivicImage
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="font-mono text-slate-600">
                        {complaint.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{complaint.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatShortDate(complaint.reportedAt)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {complaint.address}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <StatusIndicator status={complaint.status} />
                    <PriorityIndicator priority={complaint.priority} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Small Map Preview */}
        <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                Neighborhood Map Preview
              </h3>
              <p className="text-xs text-slate-500">
                Active hazards &amp; resolved cases nearby
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('community-map')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] whitespace-nowrap cursor-pointer"
            >
              <span>Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-h-[280px]">
            <CivicLeafletMap
              complaints={complaints}
              onInspectComplaint={onInspectComplaint}
              heightClass="h-full min-h-[280px]"
              zoom={13}
              showLegend={true}
              showControls={true}
            />
          </div>
        </section>
      </div>

      {/* Bottom Row: Nearby Civic Issues + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Civic Issues */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                Nearby Civic Issues
              </h3>
              <p className="text-xs text-slate-500">
                Reported by neighbors across adjacent blocks
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('community-map')}
              className="text-xs font-semibold text-[#0D9488] hover:text-[#0F2942] cursor-pointer"
            >
              Inspect on map
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {nearbyIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => onInspectComplaint(issue.id)}
                className="w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span className="font-medium text-[#0F2942]">
                      {issue.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{issue.neighborhood}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {issue.title}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.address}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <StatusIndicator status={issue.status} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-base font-display font-semibold text-[#0F2942]">
              Recent Activity
            </h3>
            <p className="text-xs text-slate-500">
              Latest updates from municipal crews &amp; dispatch
            </p>
          </div>
          <div className="p-5 space-y-4">
            {recentActivity.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onInspectComplaint(event.complaintId)}
                className="w-full text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-teal-50 transition-colors">
                  {event.status === 'Resolved' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-[#0F2942]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-[#0D9488] truncate">
                      {event.title}
                    </p>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {event.complaintId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {event.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 tabular-nums">
                    {event.actor} · {formatDateTime(event.timestamp)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
