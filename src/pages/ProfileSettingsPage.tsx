import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Lock,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { CivicImage } from '../components/ui/CivicImage';
import { UserProfile, UserRole } from '../types/civic';

interface ProfileSettingsPageProps {
  profile: UserProfile;
  role: UserRole;
  onUpdateProfile: (next: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  profile,
  role,
  onUpdateProfile,
  onLogout,
}) => {
  const [form, setForm] = useState<UserProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const toggleNotification = (
    key: keyof UserProfile['notifications']
  ) => {
    const next: UserProfile = {
      ...form,
      notifications: {
        ...form.notifications,
        [key]: !form.notifications[key],
      },
    };
    setForm(next);
    onUpdateProfile(next);
  };

  const togglePrivacy = (key: keyof UserProfile['privacy']) => {
    const next: UserProfile = {
      ...form,
      privacy: {
        ...form.privacy,
        [key]: !form.privacy[key],
      },
    };
    setForm(next);
    onUpdateProfile(next);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Identity Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <CivicImage
            src={form.avatarUrl}
            alt={form.name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <h2 className="text-xl font-display font-bold text-[#0F2942]">
              {form.name}
            </h2>
            <p className="text-sm text-slate-600">{form.email}</p>
            <p className="text-xs text-slate-500 mt-1">
              {role === 'admin'
                ? 'Municipal Operations Administrator'
                : 'Verified Resident Reporter'}{' '}
              · {form.neighborhood}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors self-start sm:self-center cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <User className="w-4 h-4 text-[#0D9488]" />
          <h3 className="text-base font-display font-semibold text-[#0F2942]">
            Account Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-neighborhood"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Primary Neighborhood / Ward
            </label>
            <input
              id="profile-neighborhood"
              type="text"
              value={form.neighborhood}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Phone Number (Optional)
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div>
            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account settings saved for this session.</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Notification Preferences & Privacy Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Bell className="w-4 h-4 text-[#0D9488]" />
            <h3 className="text-base font-display font-semibold text-[#0F2942]">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'statusUpdates' as const,
                title: 'Complaint Status Changes',
                desc: 'Notify when your report moves to Under Review, In Progress, or Resolved.',
              },
              {
                key: 'nearbyIssues' as const,
                title: 'Nearby Hazard Alerts',
                desc: 'Alert when a high-priority issue is reported within 500m of your neighborhood.',
              },
              {
                key: 'adminDirectMessages' as const,
                title: 'Dispatcher Remarks',
                desc: 'Email updates when municipal crews post inspection notes.',
              },
              {
                key: 'weeklyDigest' as const,
                title: 'Weekly Ward Summary',
                desc: 'Digest of neighborhood repairs and resolution metrics.',
              },
            ].map((item) => {
              const checked = form.notifications[item.key];
              return (
                <label
                  key={item.key}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleNotification(item.key)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F2942] focus:ring-[#0D9488] cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Lock className="w-4 h-4 text-[#0D9488]" />
            <h3 className="text-base font-display font-semibold text-[#0F2942]">
              Privacy Settings
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'anonymousPublicMap' as const,
                title: 'Hide Name on Public Map',
                desc: 'Display "Community Resident" publicly while keeping your details visible to municipal dispatchers.',
              },
              {
                key: 'exactGpsOnPublicMap' as const,
                title: 'Share Exact Street Coordinates',
                desc: 'Allow public map visitors to inspect exact pin locations for reported hazards.',
              },
              {
                key: 'allowFollowUpContact' as const,
                title: 'Allow Field Crew Clarification',
                desc: 'Permit public works inspectors to contact you if access details are needed.',
              },
            ].map((item) => {
              const checked = form.privacy[item.key];
              return (
                <label
                  key={item.key}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePrivacy(item.key)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F2942] focus:ring-[#0D9488] cursor-pointer"
                  />
                </label>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
            <span>
              Settings are stored locally in your browser session for this
              demonstration prototype.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
