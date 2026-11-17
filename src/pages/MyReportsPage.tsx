import React, { useMemo, useState } from 'react';
import {
  Eye,
  FilePlus2,
  LayoutGrid,
  List,
  MapPin,
  Search,
} from 'lucide-react';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { ISSUE_CATEGORIES } from '../data/mockComplaints';
import { AppView, CivicComplaint, ComplaintStatus } from '../types/civic';
import { formatShortDate } from '../utils/geo';

interface MyReportsPageProps {
  complaints: CivicComplaint[];
  onInspectComplaint: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({
  complaints,
  onInspectComplaint,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'mine' | 'all'>('mine');

  const baseList = useMemo(() => {
    return scope === 'mine'
      ? complaints.filter((c) => c.isOwnReport)
      : complaints;
  }, [complaints, scope]);

  const filtered = useMemo(() => {
    return baseList.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' || c.status === (statusFilter as ComplaintStatus);
      const matchesCategory =
        categoryFilter === 'All' || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [baseList, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-[#0F2942]">
            Submitted Civic Reports
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor review progress, field crew dispatch, and resolution remarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setScope('mine')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                scope === 'mine'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Submissions ({complaints.filter((c) => c.isOwnReport).length})
            </button>
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                scope === 'all'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Community Feed ({complaints.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('report-issue')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, title, or address..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Report</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Duplicate">Duplicate</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
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

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 tabular-nums mr-1">
            {filtered.length} reports
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Card view"
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-base font-display font-semibold text-[#0F2942] mb-1">
            No reports match your current filters
          </p>
          <p className="text-sm text-slate-500 mb-5">
            Reset the search or filter selections, or submit a new civic issue.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setCategoryFilter('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => onNavigate('report-issue')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg cursor-pointer"
            >
              Report an Issue
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Issue &amp; Photo</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <CivicImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[240px]">
                            {item.title}
                          </p>
                          <PriorityIndicator priority={item.priority} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-800 truncate max-w-[200px]">
                        {item.address}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.neighborhood}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {formatShortDate(item.reportedAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusIndicator status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onInspectComplaint(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <CivicImage
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-44 object-cover border-b border-slate-200"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="font-mono text-slate-500">{item.id}</span>
                    <StatusIndicator status={item.status} />
                  </div>
                  <h3 className="text-base font-display font-semibold text-[#0F2942] mb-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {formatShortDate(item.reportedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                    <span className="truncate">
                      {item.address} ({item.neighborhood})
                    </span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <PriorityIndicator priority={item.priority} />
                  <button
                    type="button"
                    onClick={() => onInspectComplaint(item.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
