export type IssueCategory =
  | 'Pothole'
  | 'Damaged Road'
  | 'Overflowing Garbage'
  | 'Water Leakage'
  | 'Broken Streetlight'
  | 'Damaged Sidewalk'
  | 'Drainage Blockage';

export type ComplaintStatus =
  | 'New'
  | 'Under Review'
  | 'In Progress'
  | 'Resolved'
  | 'Duplicate';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type UserRole = 'citizen' | 'admin';

export type AppView =
  | 'landing'
  | 'citizen-dashboard'
  | 'report-issue'
  | 'community-map'
  | 'my-reports'
  | 'complaint-details'
  | 'community-insights'
  | 'admin-dashboard'
  | 'admin-management'
  | 'profile-settings';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface CivicComplaint {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  imageUrl: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  reportedAt: string;
  reporterName: string;
  reporterEmail: string;
  isOwnReport: boolean;
  status: ComplaintStatus;
  priority: PriorityLevel;
  adminRemarks: string;
  assignedCrew?: string;
  aiConfidenceDemo?: number;
  timeline: TimelineEvent[];
}

export interface AiDetectionDemoResult {
  predictedCategory: IssueCategory;
  confidencePercent: number;
  suggestedSeverity: PriorityLevel;
  detectedFeatures: string[];
  isDemonstration: true;
}

export interface UserProfile {
  name: string;
  email: string;
  neighborhood: string;
  phone: string;
  avatarUrl: string;
  notifications: {
    statusUpdates: boolean;
    nearbyIssues: boolean;
    weeklyDigest: boolean;
    adminDirectMessages: boolean;
  };
  privacy: {
    anonymousPublicMap: boolean;
    exactGpsOnPublicMap: boolean;
    allowFollowUpContact: boolean;
  };
}
