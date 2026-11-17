import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Flag,
} from 'lucide-react';
import { ComplaintStatus, PriorityLevel } from '../../types/civic';

export const StatusIndicator: React.FC<{ status: ComplaintStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Resolved</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>In Progress</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 whitespace-nowrap">
          <Eye className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Under Review</span>
        </span>
      );
    case 'Duplicate':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Duplicate</span>
        </span>
      );
    case 'New':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>New Report</span>
        </span>
      );
  }
};

export const PriorityIndicator: React.FC<{ priority: PriorityLevel }> = ({
  priority,
}) => {
  switch (priority) {
    case 'High':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 whitespace-nowrap">
          <Flag className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>High Priority</span>
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap">
          <Flag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Medium Priority</span>
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
          <Flag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Low Priority</span>
        </span>
      );
  }
};
