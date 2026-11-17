import React from 'react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Compass,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import { AppView, CivicComplaint, UserRole } from '../types/civic';

interface LandingPageProps {
  complaints: CivicComplaint[];
  onNavigate: (view: AppView, role?: UserRole) => void;
  onInspectComplaint: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  complaints,
  onNavigate,
  onInspectComplaint,
}) => {
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const activeCount = complaints.length - resolvedCount;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 clean zones separated by gap-8 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title (single line, no subtitle/badges) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-[#0F2942] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-[#0F2942] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#2DD4BF]" strokeWidth={2.25} />
            </span>
            <span>Smart Community</span>
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onNavigate('community-map', 'citizen')}
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Community Map
            </button>
            <button
              type="button"
              onClick={() => onNavigate('community-insights', 'citizen')}
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Insights
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('citizen-dashboard', 'citizen')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-10 lg:pt-16 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Hero Copy */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-wide text-[#0D9488] mb-3">
                Civic Infrastructure &amp; Issue Tracking Platform
              </p>
              <h1
                className="font-display font-bold text-[#0F2942] tracking-tight leading-[1.12] mb-5"
                style={{
                  fontSize: 'clamp(2.25rem, 3.8vw, 3.25rem)',
                  textWrap: 'balance',
                }}
              >
                Make Your Community Better, One Report at a Time.
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl mb-8">
                Report potholes, broken streetlights, overflowing waste bins, and
                water leaks in seconds. Smart Community pairs photo-assisted
                categorization with live neighborhood mapping so municipal crews
                respond faster and residents stay informed.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={() => onNavigate('report-issue', 'citizen')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('community-map', 'citizen')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0F2942] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#0D9488]" />
                  <span>Explore Community Map</span>
                </button>
              </div>

              {/* Direct Portal Shortcuts */}
              <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-slate-200 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => onNavigate('citizen-dashboard', 'citizen')}
                  className="font-medium text-slate-700 hover:text-[#0F2942] underline underline-offset-4 cursor-pointer"
                >
                  Citizen Dashboard
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-dashboard', 'admin')}
                  className="font-medium text-slate-700 hover:text-[#0F2942] underline underline-offset-4 cursor-pointer"
                >
                  Administrator Console
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('my-reports', 'citizen')}
                  className="font-medium text-slate-700 hover:text-[#0F2942] underline underline-offset-4 cursor-pointer"
                >
                  Track My Reports
                </button>
              </div>
            </div>

            {/* Hero Visual Map Preview */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between px-2 pb-2.5 text-xs text-slate-600">
                  <span className="font-display font-semibold text-[#0F2942]">
                    Live District Map Preview
                  </span>
                  <span className="tabular-nums text-slate-500">
                    {activeCount} active · {resolvedCount} resolved
                  </span>
                </div>
                <div className="flex-1 min-h-[340px]">
                  <CivicLeafletMap
                    complaints={complaints}
                    onInspectComplaint={(id) => onInspectComplaint(id)}
                    heightClass="h-full min-h-[340px]"
                    zoom={13}
                    showLegend={true}
                    showControls={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Quantitative Proof Strip (Demonstration Metrics) */}
          <div className="mt-10 bg-white border border-slate-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Issues Logged (Demo)
              </p>
              <p className="text-2xl font-display font-bold text-[#0F2942] tabular-nums">
                1,248
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across 6 municipal wards
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Verified Resolution Rate
              </p>
              <p className="text-2xl font-display font-bold text-[#059669] tabular-nums">
                84.6%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Last 6 months sample data
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Median Crew Dispatch
              </p>
              <p className="text-2xl font-display font-bold text-[#0F2942] tabular-nums">
                18.4 hrs
              </p>
              <p className="text-xs text-slate-500 mt-1">
                High-priority hazard triage
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Duplicate Merge Accuracy
              </p>
              <p className="text-2xl font-display font-bold text-[#0D9488] tabular-nums">
                250 m
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Automated proximity clustering
              </p>
            </div>
          </div>
        </section>

        {/* Core Capabilities Bento Section */}
        <section id="features" className="max-w-[1200px] mx-auto px-6 py-14 border-t border-slate-200">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#0D9488] mb-2">
              Platform Capabilities
            </p>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-[#0F2942] tracking-tight">
              Built for rapid citizen intake and municipal accountability
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Marquee Feature 01 (2-column span) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-stretch">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-2">
                    01. Assisted Intake
                  </p>
                  <h3 className="text-xl font-display font-semibold text-[#0F2942] mb-2.5">
                    AI-Assisted Issue Detection
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Upload a street photograph and Smart Community automatically
                    suggests the issue category, estimates severity, and highlights
                    key visual cues—while keeping citizens in control to verify or
                    correct before submission.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="font-medium text-[#0F2942]">
                    Demo Prediction: Pothole
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-[#0D9488] font-medium">
                    94.6% confidence
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-red-700 font-medium">High Severity</span>
                </div>
              </div>
              <div className="w-full md:w-56 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <CivicImage
                  src="/src/assets/images/issue_pothole_road_1794911256695.jpg"
                  alt="Pothole road inspection photograph"
                  className="w-full h-44 md:h-full object-cover"
                />
              </div>
            </div>

            {/* Feature 02 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-2">
                  02. Geospatial Routing
                </p>
                <h3 className="text-xl font-display font-semibold text-[#0F2942] mb-2.5">
                  Location-Based Reporting
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Detect coordinates in one click or fine-tune the pin directly on
                  the street map. Municipal dispatchers automatically see nearby
                  reports within 250 meters to consolidate field crew routes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('community-map', 'citizen')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:text-[#0F2942] transition-colors cursor-pointer"
              >
                <span>Open Interactive Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 03 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-2">
                  03. Full Transparency
                </p>
                <h3 className="text-xl font-display font-semibold text-[#0F2942] mb-2.5">
                  Complaint Progress Tracking
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Every submitted complaint receives a permanent tracking ID,
                  timestamped status log, and official public works remarks from
                  intake through verified field resolution.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('my-reports', 'citizen')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:text-[#0F2942] transition-colors cursor-pointer"
              >
                <span>View Sample Reports</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 04 (2-column span) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-mono text-slate-500 mb-2">
                  04. Municipal Command
                </p>
                <h3 className="text-xl font-display font-semibold text-[#0F2942] mb-2.5">
                  Administrator Triage &amp; Hotspot Analytics
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  City operations teams filter high-priority hazards, detect
                  duplicate street reports by GPS proximity, update crew dispatch
                  statuses, and analyze neighborhood hotspot trends.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('admin-dashboard', 'admin')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
                  >
                    Launch Admin Console
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('community-insights', 'citizen')}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Explore Analytics
                  </button>
                </div>
              </div>
              <div className="w-full md:w-64 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Downtown Core</span>
                  <span className="font-mono font-semibold text-[#0F2942] tabular-nums">
                    48 potholes
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F2942] rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Denny Triangle</span>
                  <span className="font-mono font-semibold text-[#0F2942] tabular-nums">
                    41 potholes
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D9488] rounded-full" style={{ width: '69%' }} />
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Sample hotspot telemetry preview
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-14">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">
                Three-Step Workflow
              </p>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-[#0F2942] tracking-tight">
                From street observation to verified repair
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[#0F2942] text-white flex items-center justify-center mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs font-mono text-slate-500 mb-1">Step 01</p>
                <h3 className="text-lg font-display font-semibold text-[#0F2942] mb-2">
                  Photograph the Problem
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Capture or drag-and-drop a photo of the damaged road, leaking
                  pipe, or broken fixture. Review the automated category and
                  severity suggestion.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[#0D9488] text-white flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-mono text-slate-500 mb-1">Step 02</p>
                <h3 className="text-lg font-display font-semibold text-[#0F2942] mb-2">
                  Confirm Location on Map
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use browser geolocation or adjust the interactive street pin to
                  mark the exact curb, crosswalk, or intersection for field crews.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[#059669] text-white flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-mono text-slate-500 mb-1">Step 03</p>
                <h3 className="text-lg font-display font-semibold text-[#0F2942] mb-2">
                  Track Status &amp; Remarks
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Follow your complaint from New Report through Under Review,
                  Crew Dispatch, and Resolved with real-time updates from city
                  administrators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Conversion Band */}
        <section className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="bg-[#0F2942] text-white rounded-xl p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-display font-bold tracking-tight mb-2">
                Ready to inspect or submit a civic report?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore the full citizen reporting flow, live interactive district
                map, and municipal administrator triage console using realistic
                demonstration data.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('report-issue', 'citizen')}
                className="px-5 py-2.5 text-sm font-semibold bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Report an Issue
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-dashboard', 'admin')}
                className="px-5 py-2.5 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Admin Console
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-700 font-display font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>Smart Community Civic Platform</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('citizen-dashboard', 'citizen')}
              className="hover:text-[#0F2942] cursor-pointer"
            >
              Citizen Portal
            </button>
            <button
              type="button"
              onClick={() => onNavigate('community-map', 'citizen')}
              className="hover:text-[#0F2942] cursor-pointer"
            >
              Community Map
            </button>
            <button
              type="button"
              onClick={() => onNavigate('community-insights', 'citizen')}
              className="hover:text-[#0F2942] cursor-pointer"
            >
              Insights
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin-dashboard', 'admin')}
              className="hover:text-[#0F2942] cursor-pointer"
            >
              Administrator Console
            </button>
          </div>
          <p className="text-slate-400">
            Demonstration prototype with local sample data
          </p>
        </div>
      </footer>
    </div>
  );
};
