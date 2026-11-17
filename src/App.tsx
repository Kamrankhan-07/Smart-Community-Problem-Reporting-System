import React, { useEffect, useState } from 'react';
import { WorkspaceShell } from './components/layout/WorkspaceShell';
import { INITIAL_COMPLAINTS, INITIAL_USER_PROFILE } from './data/mockComplaints';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminManagementPage } from './pages/AdminManagementPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CommunityInsightsPage } from './pages/CommunityInsightsPage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { LandingPage } from './pages/LandingPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import {
  AppView,
  CivicComplaint,
  ComplaintStatus,
  PriorityLevel,
  UserProfile,
  UserRole,
} from './types/civic';

const STORAGE_KEYS = {
  complaints: 'smart_community_complaints_v1',
  profile: 'smart_community_profile_v1',
};

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [role, setRole] = useState<UserRole>('citizen');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null
  );
  const [adminTargetId, setAdminTargetId] = useState<string | null>(null);

  const [complaints, setComplaints] = useState<CivicComplaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.complaints);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial demonstration dataset
    }
    return INITIAL_COMPLAINTS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to default profile
    }
    return INITIAL_USER_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
    } catch {
      // Ignore storage quota errors
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile));
    } catch {
      // Ignore storage quota errors
    }
  }, [userProfile]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView]);

  const handleNavigate = (view: AppView, nextRole?: UserRole) => {
    if (nextRole) {
      setRole(nextRole);
    }
    setCurrentView(view);
  };

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    if (nextRole === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('citizen-dashboard');
    }
  };

  const handleInspectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentView('complaint-details');
  };

  const handleOpenAdminManage = (id: string) => {
    setRole('admin');
    setAdminTargetId(id);
    setCurrentView('admin-management');
  };

  const handleSubmitComplaint = (newComplaint: CivicComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleUpdateComplaint = (
    id: string,
    updates: {
      status: ComplaintStatus;
      priority: PriorityLevel;
      adminRemarks: string;
      assignedCrew?: string;
    }
  ) => {
    const nowIso = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const statusChanged = item.status !== updates.status;
        const nextTimeline = [...item.timeline];

        nextTimeline.push({
          id: `t-${Date.now()}`,
          status: updates.status,
          title: statusChanged
            ? `Status updated to ${updates.status}`
            : 'Administrator Remarks Updated',
          description:
            updates.adminRemarks ||
            `Case updated by Municipal Dispatch (${updates.priority} Priority).`,
          timestamp: nowIso,
          actor: 'Marcus Chen (City Dispatch)',
        });

        return {
          ...item,
          status: updates.status,
          priority: updates.priority,
          adminRemarks: updates.adminRemarks,
          assignedCrew: updates.assignedCrew,
          timeline: nextTimeline,
        };
      })
    );
  };

  const openComplaintCount = complaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Duplicate'
  ).length;

  if (currentView === 'landing') {
    return (
      <LandingPage
        complaints={complaints}
        onNavigate={handleNavigate}
        onInspectComplaint={handleInspectComplaint}
      />
    );
  }

  const activeDetailComplaint = complaints.find(
    (c) => c.id === selectedComplaintId
  );

  return (
    <WorkspaceShell
      currentView={currentView}
      role={role}
      userProfile={userProfile}
      openCount={openComplaintCount}
      onNavigate={(view) => handleNavigate(view)}
      onRoleChange={handleRoleChange}
      onExitToLanding={() => handleNavigate('landing')}
    >
      {currentView === 'citizen-dashboard' && (
        <CitizenDashboard
          userProfile={userProfile}
          complaints={complaints}
          onNavigate={(view) => handleNavigate(view)}
          onInspectComplaint={handleInspectComplaint}
        />
      )}

      {currentView === 'report-issue' && (
        <ReportIssuePage
          existingComplaints={complaints}
          userProfile={userProfile}
          onSubmitComplaint={handleSubmitComplaint}
          onViewDetails={handleInspectComplaint}
        />
      )}

      {currentView === 'community-map' && (
        <CommunityMapPage
          complaints={complaints}
          onInspectComplaint={handleInspectComplaint}
        />
      )}

      {currentView === 'my-reports' && (
        <MyReportsPage
          complaints={complaints}
          onInspectComplaint={handleInspectComplaint}
          onNavigate={(view) => handleNavigate(view)}
        />
      )}

      {currentView === 'complaint-details' && (
        <ComplaintDetailsPage
          complaint={activeDetailComplaint}
          onBack={() =>
            handleNavigate(role === 'admin' ? 'admin-management' : 'my-reports')
          }
          onOpenAdminManage={handleOpenAdminManage}
        />
      )}

      {currentView === 'community-insights' && (
        <CommunityInsightsPage
          complaints={complaints}
          onInspectComplaint={handleInspectComplaint}
        />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminDashboardPage
          complaints={complaints}
          onNavigate={(view) => handleNavigate(view)}
          onManageComplaint={handleOpenAdminManage}
          onInspectComplaint={handleInspectComplaint}
        />
      )}

      {currentView === 'admin-management' && (
        <AdminManagementPage
          complaints={complaints}
          initialSelectedId={adminTargetId}
          onUpdateComplaint={handleUpdateComplaint}
          onInspectComplaint={handleInspectComplaint}
        />
      )}

      {currentView === 'profile-settings' && (
        <ProfileSettingsPage
          profile={userProfile}
          role={role}
          onUpdateProfile={setUserProfile}
          onLogout={() => handleNavigate('landing')}
        />
      )}
    </WorkspaceShell>
  );
}

export default App;
