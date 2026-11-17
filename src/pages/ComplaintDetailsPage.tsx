import React from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { CivicComplaint } from '../types/civic';
import { formatDateTime } from '../utils/geo';

interface ComplaintDetailsPageProps {
  complaint: CivicComplaint | undefined;
  onBack: () => void;
  onOpenAdminManage: (id: string) => void;
}

export const ComplaintDetailsPage: React.FC<ComplaintDetailsPageProps> = ({
  complaint,
  onBack,
  onOpenAdminManage,
}) => {
  if (!complaint) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-base font-display font-semibold text-[#0F2942] mb-2">
          Complaint not found
        </p>
        <p className="text-sm text-slate-500 mb-4">
          The requested report ID could not be located in the current session.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold bg-[#0F2942] text-white rounded-lg cursor-pointer"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0F2942] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAdminManage(complaint.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F2942] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Manage in Admin Console</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-1.5">
              <span className="font-mono font-semibold text-[#0F2942]">
                {complaint.id}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">
                {complaint.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{complaint.neighborhood}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0F2942] tracking-tight">
              {complaint.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <PriorityIndicator priority={complaint.priority} />
            <StatusIndicator status={complaint.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Photograph */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <CivicImage
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            {complaint.aiConfidenceDemo && (
              <p className="text-xs text-slate-500 tabular-nums">
                Demo AI intake classification: {complaint.category} (
                {complaint.aiConfidenceDemo}% sample confidence)
              </p>
            )}
          </div>

          {/* Metadata & Description */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Citizen Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {complaint.address}
                    </p>
                    <p className="font-mono text-slate-500 tabular-nums mt-0.5">
                      {complaint.lat.toFixed(5)}, {complaint.lng.toFixed(5)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      Date &amp; Time Reported
                    </p>
                    <p className="text-slate-500 tabular-nums mt-0.5">
                      {formatDateTime(complaint.reportedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Reported By</p>
                    <p className="text-slate-500 mt-0.5">
                      {complaint.reporterName}
                    </p>
                  </div>
                </div>

                {complaint.assignedCrew && (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Assigned Unit
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        {complaint.assignedCrew}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Administrator Remarks */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2942] mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Official Administrator Remarks</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {complaint.adminRemarks ||
                  'Pending initial dispatcher remarks.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Timeline + Exact Location Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Timeline */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-display font-semibold text-[#0F2942] mb-4">
            Status Update Timeline
          </h3>
          <div className="space-y-5">
            {complaint.timeline.map((event, idx) => {
              const isLatest = idx === complaint.timeline.length - 1;
              return (
                <div key={event.id} className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        event.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600'
                          : isLatest
                            ? 'bg-[#0F2942] text-white'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {event.status === 'Resolved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {idx < complaint.timeline.length - 1 && (
                      <div className="w-px h-8 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <span className="text-xs text-slate-500 tabular-nums">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Updated by {event.actor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Exact Location Map */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                Reported Location Pin
              </h3>
              <p className="text-xs text-slate-500">{complaint.address}</p>
            </div>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}
            </span>
          </div>
          <div className="flex-1 min-h-[260px]">
            <CivicLeafletMap
              complaints={[complaint]}
              selectedComplaintId={complaint.id}
              center={[complaint.lat, complaint.lng]}
              zoom={16}
              heightClass="h-full min-h-[260px]"
              showLegend={false}
              showControls={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
