import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  RotateCcw,
  Search,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import { PriorityIndicator, StatusIndicator } from '../components/ui/StatusIndicator';
import { ISSUE_CATEGORIES } from '../data/mockComplaints';
import { CivicComplaint } from '../types/civic';
import { formatShortDate } from '../utils/geo';

interface CommunityMapPageProps {
  complaints: CivicComplaint[];
  onInspectComplaint: (id: string) => void;
}

export const CommunityMapPage: React.FC<CommunityMapPageProps> = ({
  complaints,
  onInspectComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Resolved'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<CivicComplaint | null>(
    complaints[0] || null
  );

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.address.toLowerCase().includes(q) ||
        c.neighborhood.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Resolved'
            ? c.status === 'Resolved'
            : c.status !== 'Resolved' && c.status !== 'Duplicate';

      const matchesPriority =
        priorityFilter === 'All' || c.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [complaints, searchQuery, selectedCategory, statusFilter, priorityFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div className="space-y-4">
      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search by location or ID */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, neighborhood, or ID..."
              aria-label="Search map by location"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by issue category"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          >
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Status Segmented Tabs + Count */}
        <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['All', 'Open', 'Resolved'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-[#0F2942] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums whitespace-nowrap">
            {filteredComplaints.length} shown
          </span>
        </div>
      </div>

      {/* Main Split: Large Interactive Map + Nearby Reports Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Map Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <CivicLeafletMap
            complaints={filteredComplaints}
            selectedComplaintId={selectedComplaint?.id ?? null}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
            onInspectComplaint={(id) => onInspectComplaint(id)}
            heightClass="h-[520px] lg:h-[600px]"
            zoom={13}
            showLegend={true}
            showControls={true}
          />
        </div>

        {/* Nearby Reports & Selected Issue Panel */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden h-[600px]">
          <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-display font-semibold text-[#0F2942]">
                Reported Issues in View
              </h2>
              <p className="text-xs text-slate-500">
                Select any issue to focus its map marker
              </p>
            </div>
            {(searchQuery ||
              selectedCategory !== 'All' ||
              statusFilter !== 'All' ||
              priorityFilter !== 'All') && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0D9488] hover:text-[#0F2942] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Selected Issue Quick Detail Card */}
          {selectedComplaint &&
            filteredComplaints.some((c) => c.id === selectedComplaint.id) && (
              <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
                <div className="flex items-start gap-3">
                  <CivicImage
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.title}
                    className="w-20 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-500">
                        {selectedComplaint.id}
                      </span>
                      <StatusIndicator status={selectedComplaint.status} />
                    </div>
                    <h3 className="text-sm font-display font-semibold text-[#0F2942] truncate mt-0.5">
                      {selectedComplaint.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {selectedComplaint.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <PriorityIndicator priority={selectedComplaint.priority} />
                  <button
                    type="button"
                    onClick={() => onInspectComplaint(selectedComplaint.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  No matching civic issues
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Try clearing your search query or adjusting the category and
                  status filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold bg-[#0F2942] text-white rounded-lg cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredComplaints.map((item) => {
                const isSelected = selectedComplaint?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedComplaint(item)}
                    className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span className="font-mono text-slate-500">{item.id}</span>
                      <StatusIndicator status={item.status} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.category} — {item.neighborhood}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.address}</span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0 tabular-nums">
                        {formatShortDate(item.reportedAt)}
                      </span>
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
