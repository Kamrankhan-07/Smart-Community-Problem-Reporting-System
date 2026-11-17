import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  MapPin,
  Search,
  UserCheck,
} from 'lucide-react';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { ISSUE_CATEGORIES } from '../data/mockComplaints';
import {
  CivicComplaint,
  ComplaintStatus,
  PriorityLevel,
} from '../types/civic';
import {
  calculateDistanceMeters,
  formatDistance,
  formatShortDate,
} from '../utils/geo';

interface AdminManagementPageProps {
  complaints: CivicComplaint[];
  initialSelectedId?: string | null;
  onUpdateComplaint: (
    id: string,
    updates: {
      status: ComplaintStatus;
      priority: PriorityLevel;
      adminRemarks: string;
      assignedCrew?: string;
    }
  ) => void;
  onInspectComplaint: (id: string) => void;
}

const ALL_STATUSES: ComplaintStatus[] = [
  'New',
  'Under Review',
  'In Progress',
  'Resolved',
  'Duplicate',
];

export const AdminManagementPage: React.FC<AdminManagementPageProps> = ({
  complaints,
  initialSelectedId,
  onUpdateComplaint,
  onInspectComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || complaints[0]?.id || ''
  );

  // Sync if navigated from Admin Dashboard with a specific complaint ID
  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
    }
  }, [initialSelectedId]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.reporterName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'All' || c.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchQuery, statusFilter, categoryFilter]);

  const activeComplaint = useMemo(
    () =>
      complaints.find((c) => c.id === selectedId) ||
      filtered[0] ||
      complaints[0],
    [complaints, filtered, selectedId]
  );

  // Editable form state for active complaint
  const [draftStatus, setDraftStatus] = useState<ComplaintStatus>('New');
  const [draftPriority, setDraftPriority] = useState<PriorityLevel>('High');
  const [draftCrew, setDraftCrew] = useState('');
  const [draftRemarks, setDraftRemarks] = useState('');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (activeComplaint) {
      setDraftStatus(activeComplaint.status);
      setDraftPriority(activeComplaint.priority);
      setDraftCrew(activeComplaint.assignedCrew || '');
      setDraftRemarks(activeComplaint.adminRemarks || '');
      setSaveSuccess(null);
    }
  }, [activeComplaint]);

  // Nearby / Potential Duplicate Detector (within 650m, highlighting <= 250m)
  const nearbyReports = useMemo(() => {
    if (!activeComplaint) return [];
    return complaints
      .filter((c) => c.id !== activeComplaint.id)
      .map((other) => ({
        complaint: other,
        distanceMeters: calculateDistanceMeters(
          activeComplaint.lat,
          activeComplaint.lng,
          other.lat,
          other.lng
        ),
      }))
      .filter((entry) => entry.distanceMeters <= 750)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [activeComplaint, complaints]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    onUpdateComplaint(activeComplaint.id, {
      status: draftStatus,
      priority: draftPriority,
      adminRemarks: draftRemarks.trim(),
      assignedCrew: draftCrew.trim() || undefined,
    });

    setSaveSuccess(
      `Updated ${activeComplaint.id} to "${draftStatus}". Timeline & public map synced.`
    );
  };

  const handleMarkDuplicateOf = (parentId: string) => {
    if (!activeComplaint) return;
    const remark = `Marked as duplicate of nearby report ${parentId} for consolidated crew dispatch.`;
    setDraftStatus('Duplicate');
    setDraftRemarks(remark);
    onUpdateComplaint(activeComplaint.id, {
      status: 'Duplicate',
      priority: draftPriority,
      adminRemarks: remark,
      assignedCrew: draftCrew.trim() || undefined,
    });
    setSaveSuccess(`Marked ${activeComplaint.id} as duplicate of ${parentId}.`);
  };

  return (
    <div className="space-y-5">
      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, address, or citizen name..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter complaints by status"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter complaints by category"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          >
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500 tabular-nums">
          {filtered.length} of {complaints.length} complaints
        </span>
      </div>

      {/* Main Split: Queue Table + Active Review & Triage Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Complaint Management Table */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-semibold text-slate-800 mb-1">
                No complaints match your search
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Clear the search box or reset status filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setCategoryFilter('All');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#0F2942] text-white rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">Report</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filtered.map((item) => {
                    const isSelected = activeComplaint?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <CivicImage
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-11 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-mono text-[11px] text-slate-500">
                                {item.id} · {formatShortDate(item.reportedAt)}
                              </p>
                              <p className="font-semibold text-slate-900 truncate max-w-[200px]">
                                {item.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <p className="font-medium text-slate-800 truncate max-w-[160px]">
                            {item.address}
                          </p>
                          <p className="text-slate-500">{item.neighborhood}</p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <PriorityIndicator priority={item.priority} />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusIndicator status={item.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Active Complaint Review & Update Panel */}
        <aside className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          {!activeComplaint ? (
            <p className="text-sm text-slate-500 text-center py-8">
              Select a complaint from the queue to inspect details and update its
              status.
            </p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <p className="font-mono text-xs text-slate-500">
                    {activeComplaint.id} · {activeComplaint.category}
                  </p>
                  <h2 className="text-base font-display font-bold text-[#0F2942] mt-0.5">
                    {activeComplaint.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onInspectComplaint(activeComplaint.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-md shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Page</span>
                </button>
              </div>

              {/* Uploaded Photo Inspection */}
              <div className="space-y-2">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <CivicImage
                    src={activeComplaint.imageUrl}
                    alt={activeComplaint.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>{activeComplaint.address}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeComplaint.reporterName}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Nearby / Potential Duplicate Detector */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-2.5 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>Nearby &amp; Potential Duplicate Check (750m)</span>
                  </h3>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {nearbyReports.length} found
                  </span>
                </div>

                {nearbyReports.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No other reports within 750 meters of this coordinate.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {nearbyReports.map(({ complaint: other, distanceMeters }) => {
                      const isCloseMatch =
                        distanceMeters <= 250 &&
                        other.category === activeComplaint.category;
                      return (
                        <div
                          key={other.id}
                          className={`p-2.5 rounded-md border text-xs flex items-center justify-between gap-2 bg-white ${
                            isCloseMatch
                              ? 'border-amber-300'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-semibold text-[#0F2942]">
                                {other.id}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span
                                className={`font-medium tabular-nums ${
                                  isCloseMatch
                                    ? 'text-amber-700'
                                    : 'text-slate-600'
                                }`}
                              >
                                {formatDistance(distanceMeters)}
                              </span>
                            </div>
                            <p className="text-slate-600 truncate mt-0.5">
                              {other.category} · {other.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCloseMatch &&
                              activeComplaint.status !== 'Duplicate' && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkDuplicateOf(other.id)}
                                  className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded cursor-pointer"
                                >
                                  Mark Dup
                                </button>
                              )}
                            <button
                              type="button"
                              onClick={() => setSelectedId(other.id)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-[#0F2942] bg-slate-100 rounded cursor-pointer"
                            >
                              Switch
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status & Remarks Update Form */}
              <form onSubmit={handleSaveChanges} className="space-y-3.5 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="admin-status-select"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="admin-status-select"
                      value={draftStatus}
                      onChange={(e) =>
                        setDraftStatus(e.target.value as ComplaintStatus)
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="admin-priority-select"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Priority
                    </label>
                    <select
                      id="admin-priority-select"
                      value={draftPriority}
                      onChange={(e) =>
                        setDraftPriority(e.target.value as PriorityLevel)
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-crew-input"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Assigned Field Crew / Unit
                  </label>
                  <input
                    id="admin-crew-input"
                    type="text"
                    value={draftCrew}
                    onChange={(e) => setDraftCrew(e.target.value)}
                    placeholder="e.g., SDOT Asphalt Crew #4"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-remarks-input"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Administrator Remarks
                  </label>
                  <textarea
                    id="admin-remarks-input"
                    rows={3}
                    value={draftRemarks}
                    onChange={(e) => setDraftRemarks(e.target.value)}
                    placeholder="Add inspection findings, dispatch ETA, or resolution verification..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>

                {saveSuccess && (
                  <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{saveSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
                >
                  Save Status &amp; Remarks
                </button>
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};
