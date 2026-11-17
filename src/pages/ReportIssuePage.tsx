import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  Crosshair,
  Info,
  Loader2,
  RotateCcw,
  ScanSearch,
  Upload,
} from 'lucide-react';
import { CivicLeafletMap } from '../components/map/CivicLeafletMap';
import { CivicImage } from '../components/ui/CivicImage';
import {
  ISSUE_CATEGORIES,
  SAMPLE_DEMO_PHOTOS,
  simulateDemoAiAnalysis,
} from '../data/mockComplaints';
import {
  AiDetectionDemoResult,
  CivicComplaint,
  IssueCategory,
  PriorityLevel,
  UserProfile,
} from '../types/civic';

interface ReportIssuePageProps {
  existingComplaints: CivicComplaint[];
  userProfile: UserProfile;
  onSubmitComplaint: (complaint: CivicComplaint) => void;
  onViewDetails: (id: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  existingComplaints,
  userProfile,
  onSubmitComplaint,
  onViewDetails,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiDetectionDemoResult | null>(null);
  const [aiConfirmed, setAiConfirmed] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('412 Pike St & 4th Ave');
  const [neighborhood, setNeighborhood] = useState(userProfile.neighborhood);
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number }>({
    lat: 47.6104,
    lng: -122.3364,
  });

  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const runDemoAiDetection = (fileLabel: string, previewUrl: string, presetAddress?: string, presetLat?: number, presetLng?: number) => {
    setImageUrl(previewUrl);
    setImageName(fileLabel);
    setIsAnalyzing(true);
    setAiConfirmed(false);
    setErrors((prev) => ({ ...prev, image: '' }));

    if (presetAddress) setAddress(presetAddress);
    if (presetLat !== undefined && presetLng !== undefined) {
      setPinPosition({ lat: presetLat, lng: presetLng });
    }

    setTimeout(() => {
      const result = simulateDemoAiAnalysis(fileLabel, previewUrl);
      setAiResult(result);
      setCategory(result.predictedCategory);
      setPriority(result.suggestedSeverity);
      if (!title.trim()) {
        setTitle(`${result.predictedCategory} reported near ${presetAddress || address}`);
      }
      setIsAnalyzing(false);
    }, 650);
  };

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please select a valid JPG, PNG, or WebP photograph.',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        runDemoAiDetection(file.name, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelected(file);
  };

  const handleDetectLocation = () => {
    setLocating(true);
    setLocationNotice(null);

    if (!navigator.geolocation) {
      setLocating(false);
      setLocationNotice(
        'Browser geolocation unavailable. Adjusted to Civic District center—drag the map pin to refine.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setPinPosition({ lat, lng });
        setAddress(`Detected GPS (${lat}, ${lng})`);
        setLocating(false);
        setLocationNotice('GPS coordinates detected. You can drag the pin on the map to fine-tune.');
      },
      () => {
        // Graceful fallback to downtown demo coordinates
        setPinPosition({ lat: 47.6118, lng: -122.3342 });
        setAddress('508 Pine St & 5th Ave (Demo GPS Fallback)');
        setLocating(false);
        setLocationNotice(
          'Location permission declined or unavailable in preview; using demo Civic District coordinates.'
        );
      },
      { timeout: 5000 }
    );
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!imageUrl) {
      nextErrors.image = 'Please upload a photograph or select a sample inspection photo.';
    }
    if (title.trim().length < 5) {
      nextErrors.title = 'Please enter a concise summary title (at least 5 characters).';
    }
    if (description.trim().length < 15) {
      nextErrors.description =
        'Please describe the issue and safety impact (at least 15 characters).';
    }
    if (!address.trim()) {
      nextErrors.address = 'Please enter a street address or cross street.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const nextNum = 419 + existingComplaints.length;
      const newId = `SC-2026-0${nextNum}`;
      const nowIso = new Date().toISOString();

      const newComplaint: CivicComplaint = {
        id: newId,
        title: title.trim(),
        category,
        description: description.trim(),
        imageUrl,
        address: address.trim(),
        neighborhood: neighborhood.trim() || 'Downtown Core',
        lat: pinPosition.lat,
        lng: pinPosition.lng,
        reportedAt: nowIso,
        reporterName: userProfile.name,
        reporterEmail: userProfile.email,
        isOwnReport: true,
        status: 'New',
        priority,
        aiConfidenceDemo: aiResult?.confidencePercent,
        adminRemarks:
          'Report received and queued for municipal triage review.',
        timeline: [
          {
            id: `t-${Date.now()}`,
            status: 'New',
            title: 'Report Submitted',
            description: `Citizen uploaded photo & pinpointed ${address.trim()}.`,
            timestamp: nowIso,
            actor: `${userProfile.name} (Citizen)`,
          },
        ],
      };

      onSubmitComplaint(newComplaint);
      setIsSubmitting(false);
      setSubmittedId(newId);
    }, 550);
  };

  const resetForm = () => {
    setImageUrl('');
    setImageName('');
    setAiResult(null);
    setAiConfirmed(false);
    setTitle('');
    setDescription('');
    setErrors({});
    setSubmittedId(null);
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono text-slate-500 mb-1">
          Tracking ID: {submittedId}
        </p>
        <h2 className="text-2xl font-display font-bold text-[#0F2942] mb-2">
          Civic Issue Report Submitted
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Your report has been added to the Community Map and municipal triage
          queue. You can track live status updates and administrator remarks at
          any time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onViewDetails(submittedId)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
          >
            View Complaint Details
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Instructions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-[#0F2942]">
            Submit a New Civic Issue
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Upload a street photograph to preview automated demonstration
            categorization, confirm the map pin, and submit to city dispatch.
          </p>
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          Fields marked with * are required
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Step 1: Photo Upload + Demo AI Detection */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-display font-semibold text-[#0F2942]">
                1. Issue Photograph &amp; Demonstration AI Detection
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag and drop an image, use your device camera, or load a sample
                inspection photo below.
              </p>
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setAiResult(null);
                  setAiConfirmed(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F2942] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replace Photo</span>
              </button>
            )}
          </div>

          {!imageUrl ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[#0D9488] bg-teal-50/50'
                    : errors.image
                      ? 'border-red-300 bg-red-50/30'
                      : 'border-slate-300 bg-slate-50/60 hover:border-slate-400'
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#0F2942]">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Drag and drop your street photograph here
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Supports JPG, PNG, or WebP up to 10 MB
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0F2942] bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>Take Photo</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelected(e.target.files?.[0])}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileSelected(e.target.files?.[0])}
                />
              </div>

              {errors.image && (
                <p className="text-xs font-medium text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.image}</span>
                </p>
              )}

              {/* Quick Sample Photo Presets for Instant Evaluation */}
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Or test with a sample inspection photograph:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_DEMO_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() =>
                        runDemoAiDetection(
                          sample.label,
                          sample.imageUrl,
                          sample.defaultAddress,
                          sample.defaultLat,
                          sample.defaultLng
                        )
                      }
                      className="text-left group border border-slate-200 hover:border-[#0D9488] rounded-lg overflow-hidden bg-white transition-colors cursor-pointer"
                    >
                      <CivicImage
                        src={sample.imageUrl}
                        alt={sample.label}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium text-slate-800 group-hover:text-[#0F2942] truncate">
                          {sample.suggestedCategory}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Uploaded Photo & Demonstration AI Detection Result */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <CivicImage
                    src={imageUrl}
                    alt="Uploaded civic issue preview"
                    className="w-full h-60 object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  File: {imageName}
                </p>
              </div>

              <div className="md:col-span-7">
                {isAnalyzing ? (
                  <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-[#0D9488] animate-spin shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#0F2942]">
                        Running simulated demonstration classification...
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Generating sample category, severity, and visual cue labels.
                      </p>
                    </div>
                  </div>
                ) : aiResult ? (
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
                    {/* Explicit Demonstration Label */}
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-900">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Simulated Demonstration Data:</strong> Sample AI
                        prediction shown for prototype workflow until a live
                        vision model is connected.
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <ScanSearch className="w-4 h-4 text-[#0D9488]" />
                        <span className="text-xs font-semibold text-slate-600">
                          Demo Detection Result
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#0D9488] tabular-nums">
                        {aiResult.confidencePercent}% confidence (demo)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label
                          htmlFor="ai-category-override"
                          className="block text-xs font-medium text-slate-500 mb-1"
                        >
                          Predicted Category (Editable)
                        </label>
                        <select
                          id="ai-category-override"
                          value={category}
                          onChange={(e) =>
                            setCategory(e.target.value as IssueCategory)
                          }
                          className="w-full px-3 py-2 text-sm font-semibold text-[#0F2942] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                        >
                          {ISSUE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="ai-severity-override"
                          className="block text-xs font-medium text-slate-500 mb-1"
                        >
                          Suggested Severity
                        </label>
                        <select
                          id="ai-severity-override"
                          value={priority}
                          onChange={(e) =>
                            setPriority(e.target.value as PriorityLevel)
                          }
                          className="w-full px-3 py-2 text-sm font-semibold text-[#0F2942] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                        >
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1.5">
                        Sample Visual Cues Highlighted:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {aiResult.detectedFeatures.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#0D9488] font-bold">·</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        {category !== aiResult.predictedCategory
                          ? `Corrected from ${aiResult.predictedCategory} to ${category}`
                          : 'Confirm category or adjust dropdown above'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAiConfirmed(true);
                          document
                            .getElementById('report-details-section')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          aiConfirmed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F2942] hover:bg-[#163A5C] text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {aiConfirmed
                            ? 'Category Confirmed'
                            : 'Continue to Details'}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </section>

        {/* Step 2: Issue Details & Location Map */}
        <div
          id="report-details-section"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left: Form Inputs */}
          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-display font-semibold text-[#0F2942]">
              2. Issue Details
            </h3>

            <div>
              <label
                htmlFor="issue-title"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Short Issue Title *
              </label>
              <input
                id="issue-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: '' }));
                }}
                placeholder="e.g., Deep pothole at westbound crosswalk"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="issue-category"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Issue Category *
                </label>
                <select
                  id="issue-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="issue-priority"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Severity Level
                </label>
                <select
                  id="issue-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                >
                  <option value="High">High — Safety / Traffic Hazard</option>
                  <option value="Medium">Medium — Needs Scheduled Repair</option>
                  <option value="Low">Low — Routine Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="issue-description"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Detailed Description *
              </label>
              <textarea
                id="issue-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((p) => ({ ...p, description: '' }));
                }}
                placeholder="Describe exact dimensions, traffic/pedestrian impact, or nearby landmarks..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="issue-address"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Street Address / Cross Street *
                </label>
                <input
                  id="issue-address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((p) => ({ ...p, address: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
                {errors.address && (
                  <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="issue-neighborhood"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Neighborhood / Ward
                </label>
                <input
                  id="issue-neighborhood"
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
            </div>
          </section>

          {/* Right: Location Pinning Map */}
          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-display font-semibold text-[#0F2942]">
                  3. Pinpoint Location
                </h3>
                <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                  Lat {pinPosition.lat}, Lng {pinPosition.lng}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5 text-[#0D9488]" />
                )}
                <span>Detect My Location</span>
              </button>
            </div>

            {locationNotice && (
              <p className="text-xs text-[#0F2942] bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                {locationNotice}
              </p>
            )}

            <div className="flex-1 min-h-[290px]">
              <CivicLeafletMap
                complaints={existingComplaints}
                interactivePinMode={true}
                pinPosition={pinPosition}
                onPinMove={(lat, lng) => setPinPosition({ lat, lng })}
                center={[pinPosition.lat, pinPosition.lng]}
                zoom={15}
                heightClass="h-full min-h-[290px]"
                showLegend={false}
                showControls={true}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit Civic Report</span>
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};
