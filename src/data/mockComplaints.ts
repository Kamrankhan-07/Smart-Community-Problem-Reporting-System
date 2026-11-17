import {
  AiDetectionDemoResult,
  CivicComplaint,
  IssueCategory,
  UserProfile,
} from '../types/civic';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Damaged Road',
  'Overflowing Garbage',
  'Water Leakage',
  'Broken Streetlight',
  'Damaged Sidewalk',
  'Drainage Blockage',
];

export const SAMPLE_DEMO_PHOTOS: {
  id: string;
  label: string;
  imageUrl: string;
  suggestedCategory: IssueCategory;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low';
  features: string[];
  defaultAddress: string;
  defaultLat: number;
  defaultLng: number;
}[] = [
  {
    id: 'sample-pothole',
    label: 'Asphalt Pothole Sample',
    imageUrl: '/src/assets/images/issue_pothole_road_1794911256695.jpg',
    suggestedCategory: 'Pothole',
    confidence: 94.6,
    severity: 'High',
    features: [
      'Deep asphalt cavity detected near crosswalk lane',
      'Exposed sub-base aggregate & standing moisture',
      'Proximity to active pedestrian & transit corridor',
    ],
    defaultAddress: '412 Pike St & 4th Ave',
    defaultLat: 47.6104,
    defaultLng: -122.3364,
  },
  {
    id: 'sample-garbage',
    label: 'Overflowing Waste Bin Sample',
    imageUrl: '/src/assets/images/issue_garbage_overflow_1794911256406.jpg',
    suggestedCategory: 'Overflowing Garbage',
    confidence: 91.8,
    severity: 'Medium',
    features: [
      'Municipal receptacle capacity exceeded',
      'Uncontained waste bags obstructing curb edge',
      'Commercial sidewalk sanitation zone',
    ],
    defaultAddress: '1508 Pine St & 15th Ave',
    defaultLat: 47.6152,
    defaultLng: -122.3132,
  },
  {
    id: 'sample-water',
    label: 'Water Main Leakage Sample',
    imageUrl: '/src/assets/images/issue_water_leakage_1794911257295.jpg',
    suggestedCategory: 'Water Leakage',
    confidence: 96.1,
    severity: 'High',
    features: [
      'Active pressurized water flow along curb gutter',
      'Sub-asphalt seepage pattern detected',
      'Potential utility main rupture risk',
    ],
    defaultAddress: '720 Madison St & 7th Ave',
    defaultLat: 47.6079,
    defaultLng: -122.3281,
  },
  {
    id: 'sample-streetlight',
    label: 'Broken Streetlight Sample',
    imageUrl: '/src/assets/images/issue_broken_streetlight_1794911257530.jpg',
    suggestedCategory: 'Broken Streetlight',
    confidence: 89.4,
    severity: 'High',
    features: [
      'Structural pole tilt > 25 degrees',
      'Shattered luminaire glass & exposed wiring',
      'Immediate pedestrian clearance hazard',
    ],
    defaultAddress: '2110 3rd Ave & Blanchard St',
    defaultLat: 47.6148,
    defaultLng: -122.3435,
  },
];

/**
 * Generates clearly labelled demonstration AI analysis results from an uploaded filename or sample photo.
 * Until a live vision inference endpoint is connected, this produces deterministic sample metadata.
 */
export function simulateDemoAiAnalysis(
  fileName: string,
  imageUrl: string
): AiDetectionDemoResult {
  const matchedSample = SAMPLE_DEMO_PHOTOS.find((s) => s.imageUrl === imageUrl);
  if (matchedSample) {
    return {
      predictedCategory: matchedSample.suggestedCategory,
      confidencePercent: matchedSample.confidence,
      suggestedSeverity: matchedSample.severity,
      detectedFeatures: matchedSample.features,
      isDemonstration: true,
    };
  }

  const lower = fileName.toLowerCase();
  if (lower.includes('trash') || lower.includes('garb') || lower.includes('waste') || lower.includes('bin')) {
    return {
      predictedCategory: 'Overflowing Garbage',
      confidencePercent: 88.5,
      suggestedSeverity: 'Medium',
      detectedFeatures: [
        'Dense refuse accumulation along curb',
        'Sanitation pickup threshold exceeded',
      ],
      isDemonstration: true,
    };
  }
  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('flood')) {
    return {
      predictedCategory: 'Water Leakage',
      confidencePercent: 92.3,
      suggestedSeverity: 'High',
      detectedFeatures: [
        'Surface water pooling & active runoff',
        'Possible underground supply line leak',
      ],
      isDemonstration: true,
    };
  }
  if (lower.includes('light') || lower.includes('lamp') || lower.includes('pole')) {
    return {
      predictedCategory: 'Broken Streetlight',
      confidencePercent: 87.9,
      suggestedSeverity: 'High',
      detectedFeatures: [
        'Fixture alignment anomaly detected',
        'Low-visibility pedestrian zone',
      ],
      isDemonstration: true,
    };
  }
  if (lower.includes('sidewalk') || lower.includes('walk') || lower.includes('pavement')) {
    return {
      predictedCategory: 'Damaged Sidewalk',
      confidencePercent: 85.4,
      suggestedSeverity: 'Medium',
      detectedFeatures: [
        'Uneven concrete slab displacement (> 2.5 cm)',
        'Accessibility / trip hazard identified',
      ],
      isDemonstration: true,
    };
  }

  return {
    predictedCategory: 'Pothole',
    confidencePercent: 91.2,
    suggestedSeverity: 'High',
    detectedFeatures: [
      'Irregular asphalt depression in roadway surface',
      'Estimated diameter > 45 cm within travel lane',
      'High vehicle & cyclist impact risk',
    ],
    isDemonstration: true,
  };
}

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Elena Vance',
  email: 'elena.vance@civicmail.org',
  neighborhood: 'Downtown Civic District',
  phone: '(206) 555-0194',
  avatarUrl: '/src/assets/images/avatar_citizen_profile_1794911257868.jpg',
  notifications: {
    statusUpdates: true,
    nearbyIssues: true,
    weeklyDigest: false,
    adminDirectMessages: true,
  },
  privacy: {
    anonymousPublicMap: false,
    exactGpsOnPublicMap: true,
    allowFollowUpContact: true,
  },
};

export const INITIAL_COMPLAINTS: CivicComplaint[] = [
  {
    id: 'SC-2026-0418',
    title: 'Deep asphalt pothole at crosswalk approach',
    category: 'Pothole',
    description:
      'Large crater-like pothole roughly 60 cm wide right in front of the westbound bus lane and crosswalk on Pike St. Cyclists are swerving into traffic to avoid it, and rainwater is undermining the surrounding asphalt.',
    imageUrl: '/src/assets/images/issue_pothole_road_1794911256695.jpg',
    address: '412 Pike St & 4th Ave',
    neighborhood: 'Downtown Core',
    lat: 47.6104,
    lng: -122.3364,
    reportedAt: '2026-11-16T09:15:00Z',
    reporterName: 'Elena Vance',
    reporterEmail: 'elena.vance@civicmail.org',
    isOwnReport: true,
    status: 'In Progress',
    priority: 'High',
    assignedCrew: 'SDOT Asphalt Crew #4',
    aiConfidenceDemo: 94.6,
    adminRemarks:
      'Inspected by Rapid Response Unit. Temporary steel plate scheduled tonight; hot-mix asphalt resurfacing assigned for Nov 18.',
    timeline: [
      {
        id: 't-1',
        status: 'New',
        title: 'Report Submitted',
        description: 'Citizen uploaded photo & GPS coordinates at 4th & Pike.',
        timestamp: '2026-11-16T09:15:00Z',
        actor: 'Elena Vance (Citizen)',
      },
      {
        id: 't-2',
        status: 'Under Review',
        title: 'Triage & Severity Verified',
        description: 'Flagged as High Priority due to transit lane and crosswalk proximity.',
        timestamp: '2026-11-16T11:40:00Z',
        actor: 'Marcus Chen (City Dispatch)',
      },
      {
        id: 't-3',
        status: 'In Progress',
        title: 'Repair Crew Dispatched',
        description: 'Assigned to SDOT Asphalt Crew #4 for structural patching.',
        timestamp: '2026-11-17T08:10:00Z',
        actor: 'Marcus Chen (City Dispatch)',
      },
    ],
  },
  {
    id: 'SC-2026-0415',
    title: 'Water main rupture flooding curb gutter',
    category: 'Water Leakage',
    description:
      'Continuous clean water bubbling up through a cracked seam along Madison St near the bus shelter. Flow has increased over the last 3 hours and is creating slick pavement conditions.',
    imageUrl: '/src/assets/images/issue_water_leakage_1794911257295.jpg',
    address: '720 Madison St & 7th Ave',
    neighborhood: 'First Hill',
    lat: 47.6079,
    lng: -122.3281,
    reportedAt: '2026-11-16T14:20:00Z',
    reporterName: 'Elena Vance',
    reporterEmail: 'elena.vance@civicmail.org',
    isOwnReport: true,
    status: 'Under Review',
    priority: 'High',
    assignedCrew: 'Public Utilities Leak Team',
    aiConfidenceDemo: 96.1,
    adminRemarks:
      'Utility crew is currently isolating the lateral valve to confirm whether it is a municipal main or private service line.',
    timeline: [
      {
        id: 't-4',
        status: 'New',
        title: 'Report Submitted',
        description: 'Photo & curb location logged via Smart Community mobile portal.',
        timestamp: '2026-11-16T14:20:00Z',
        actor: 'Elena Vance (Citizen)',
      },
      {
        id: 't-5',
        status: 'Under Review',
        title: 'Assigned to Utilities Inspection',
        description: 'Escalated to Public Utilities Leak Team for pressure testing.',
        timestamp: '2026-11-16T15:05:00Z',
        actor: 'Priya Nair (Admin)',
      },
    ],
  },
  {
    id: 'SC-2026-0412',
    title: 'Tilted streetlight pole with exposed wiring',
    category: 'Broken Streetlight',
    description:
      'Streetlight post appears to have been struck overnight. The pole is leaning sharply over the sidewalk at a 35-degree angle and the glass luminaire housing is shattered.',
    imageUrl: '/src/assets/images/issue_broken_streetlight_1794911257530.jpg',
    address: '2110 3rd Ave & Blanchard St',
    neighborhood: 'Belltown',
    lat: 47.6148,
    lng: -122.3435,
    reportedAt: '2026-11-17T06:45:00Z',
    reporterName: 'David Park',
    reporterEmail: 'd.park@example.org',
    isOwnReport: false,
    status: 'New',
    priority: 'High',
    aiConfidenceDemo: 89.4,
    adminRemarks: 'Awaiting initial electrical safety isolation check.',
    timeline: [
      {
        id: 't-6',
        status: 'New',
        title: 'Report Submitted',
        description: 'Emergency structural hazard reported by community member.',
        timestamp: '2026-11-17T06:45:00Z',
        actor: 'David Park (Citizen)',
      },
    ],
  },
  {
    id: 'SC-2026-0409',
    title: 'Overflowing municipal waste bin on retail corner',
    category: 'Overflowing Garbage',
    description:
      'Public waste receptacle has been overflowing since Friday evening with 8+ extra bags stacked around the base, blocking tactile paving at the corner.',
    imageUrl: '/src/assets/images/issue_garbage_overflow_1794911256406.jpg',
    address: '1508 Pine St & 15th Ave',
    neighborhood: 'Capitol Hill',
    lat: 47.6152,
    lng: -122.3132,
    reportedAt: '2026-11-15T11:30:00Z',
    reporterName: 'Elena Vance',
    reporterEmail: 'elena.vance@civicmail.org',
    isOwnReport: true,
    status: 'Resolved',
    priority: 'Medium',
    assignedCrew: 'Sanitation Route B-12',
    aiConfidenceDemo: 91.8,
    adminRemarks:
      'Cleared and sanitized by Route B-12. Added extra mid-week collection stop for this intersection.',
    timeline: [
      {
        id: 't-7',
        status: 'New',
        title: 'Report Submitted',
        description: 'Sanitation photo submitted.',
        timestamp: '2026-11-15T11:30:00Z',
        actor: 'Elena Vance (Citizen)',
      },
      {
        id: 't-8',
        status: 'In Progress',
        title: 'Collection Dispatched',
        description: 'Added to Sanitation Route B-12 priority clear list.',
        timestamp: '2026-11-15T13:15:00Z',
        actor: 'Marcus Chen (City Dispatch)',
      },
      {
        id: 't-9',
        status: 'Resolved',
        title: 'Area Cleared & Verified',
        description: 'Bin emptied, surrounding curb swept, extra pickup scheduled.',
        timestamp: '2026-11-15T17:45:00Z',
        actor: 'Sanitation Route B-12',
      },
    ],
  },
  {
    id: 'SC-2026-0404',
    title: 'Tree root uplifting concrete sidewalk slabs',
    category: 'Damaged Sidewalk',
    description:
      'Two concrete walkway panels are buckled nearly 8 cm upward by a mature street tree root, creating a severe tripping hazard for seniors and wheelchair users.',
    imageUrl: '/src/assets/images/issue_damaged_sidewalk_1794911257975.jpg',
    address: '914 E John St & Broadway',
    neighborhood: 'Capitol Hill',
    lat: 47.6198,
    lng: -122.3204,
    reportedAt: '2026-11-13T16:10:00Z',
    reporterName: 'Hannah Brooks',
    reporterEmail: 'h.brooks@example.org',
    isOwnReport: false,
    status: 'In Progress',
    priority: 'Medium',
    assignedCrew: 'Urban Forestry & Sidewalk Crew',
    aiConfidenceDemo: 88.2,
    adminRemarks:
      'Bevel grinding approved as interim mitigation; flexible rubberized sidewalk ramp scheduled.',
    timeline: [
      {
        id: 't-10',
        status: 'New',
        title: 'Report Submitted',
        description: 'Accessibility hazard logged with photo.',
        timestamp: '2026-11-13T16:10:00Z',
        actor: 'Hannah Brooks (Citizen)',
      },
      {
        id: 't-11',
        status: 'In Progress',
        title: 'Arborist Consultation Scheduled',
        description: 'Coordinating root-safe slab replacement.',
        timestamp: '2026-11-14T10:00:00Z',
        actor: 'Priya Nair (Admin)',
      },
    ],
  },
  {
    id: 'SC-2026-0398',
    title: 'Secondary pothole near 4th & Pine bus stop',
    category: 'Pothole',
    description:
      'Another smaller depression forming 40 meters east of the 4th & Pike intersection near the transit boarding island.',
    imageUrl: '/src/assets/images/issue_pothole_road_1794911256695.jpg',
    address: '435 Pine St & 5th Ave',
    neighborhood: 'Downtown Core',
    lat: 47.6112,
    lng: -122.3351,
    reportedAt: '2026-11-16T10:05:00Z',
    reporterName: 'Samuel Ortiz',
    reporterEmail: 's.ortiz@example.org',
    isOwnReport: false,
    status: 'New',
    priority: 'Medium',
    aiConfidenceDemo: 90.4,
    adminRemarks: 'Flagged as nearby cluster with SC-2026-0418 for combined crew repair.',
    timeline: [
      {
        id: 't-12',
        status: 'New',
        title: 'Report Submitted',
        description: 'Submitted by commuter.',
        timestamp: '2026-11-16T10:05:00Z',
        actor: 'Samuel Ortiz (Citizen)',
      },
    ],
  },
  {
    id: 'SC-2026-0392',
    title: 'Severe pavement cracking on Westlake bike lane',
    category: 'Damaged Road',
    description:
      'Longitudinal asphalt fissure running 4 meters along the protected cycle track, catching narrow bicycle tires.',
    imageUrl: '/src/assets/images/issue_pothole_road_1794911256695.jpg',
    address: '540 Westlake Ave N',
    neighborhood: 'South Lake Union',
    lat: 47.6241,
    lng: -122.3388,
    reportedAt: '2026-11-10T08:50:00Z',
    reporterName: 'Elena Vance',
    reporterEmail: 'elena.vance@civicmail.org',
    isOwnReport: true,
    status: 'Resolved',
    priority: 'Medium',
    assignedCrew: 'Bikeway Maintenance Team',
    aiConfidenceDemo: 86.7,
    adminRemarks: 'Crack sealed and resurfaced with high-friction green bike lane coating.',
    timeline: [
      {
        id: 't-13',
        status: 'New',
        title: 'Report Submitted',
        description: 'Logged via Smart Community.',
        timestamp: '2026-11-10T08:50:00Z',
        actor: 'Elena Vance (Citizen)',
      },
      {
        id: 't-14',
        status: 'Resolved',
        title: 'Resurfacing Completed',
        description: 'Cycle track repaired and reopened.',
        timestamp: '2026-11-12T15:30:00Z',
        actor: 'Bikeway Maintenance Team',
      },
    ],
  },
  {
    id: 'SC-2026-0387',
    title: 'Storm drain clogged with autumn leaf debris',
    category: 'Drainage Blockage',
    description:
      'Catch basin grate is completely sealed by compacted wet leaves, causing standing water across two traffic lanes during rain.',
    imageUrl: '/src/assets/images/issue_water_leakage_1794911257295.jpg',
    address: '1012 1st Ave & Spring St',
    neighborhood: 'Downtown Core',
    lat: 47.6051,
    lng: -122.3372,
    reportedAt: '2026-11-08T13:15:00Z',
    reporterName: 'Rachel Kim',
    reporterEmail: 'r.kim@example.org',
    isOwnReport: false,
    status: 'Resolved',
    priority: 'Low',
    assignedCrew: 'Stormwater Vactor Unit 2',
    aiConfidenceDemo: 84.9,
    adminRemarks: 'Catch basin vacuumed and flow verified.',
    timeline: [
      {
        id: 't-15',
        status: 'New',
        title: 'Report Submitted',
        description: 'Logged after morning rainstorm.',
        timestamp: '2026-11-08T13:15:00Z',
        actor: 'Rachel Kim (Citizen)',
      },
      {
        id: 't-16',
        status: 'Resolved',
        title: 'Catch Basin Cleared',
        description: 'Debris removed by Vactor Unit 2.',
        timestamp: '2026-11-09T10:20:00Z',
        actor: 'Stormwater Vactor Unit 2',
      },
    ],
  },
  {
    id: 'SC-2026-0381',
    title: 'Multi-pothole cluster on Denny Way eastbound',
    category: 'Pothole',
    description:
      'Series of three interconnected potholes forming right after the utility trench patch near Denny Way & Stewart St.',
    imageUrl: '/src/assets/images/issue_pothole_road_1794911256695.jpg',
    address: '1245 Denny Way & Stewart St',
    neighborhood: 'Denny Triangle',
    lat: 47.6186,
    lng: -122.3304,
    reportedAt: '2026-11-14T09:40:00Z',
    reporterName: 'Omar Hassan',
    reporterEmail: 'o.hassan@example.org',
    isOwnReport: false,
    status: 'Under Review',
    priority: 'High',
    aiConfidenceDemo: 93.8,
    adminRemarks: 'Reviewing contractor warranty on recent utility cut before full repave.',
    timeline: [
      {
        id: 't-17',
        status: 'New',
        title: 'Report Submitted',
        description: 'Logged with roadway photo.',
        timestamp: '2026-11-14T09:40:00Z',
        actor: 'Omar Hassan (Citizen)',
      },
      {
        id: 't-18',
        status: 'Under Review',
        title: 'Permit Audit Initiated',
        description: 'Checking utility trench permit #UT-8821.',
        timestamp: '2026-11-15T14:00:00Z',
        actor: 'Priya Nair (Admin)',
      },
    ],
  },
  {
    id: 'SC-2026-0376',
    title: 'Dark pedestrian underpass lamp outage',
    category: 'Broken Streetlight',
    description:
      'Two consecutive LED overhead fixtures are out along 2nd Ave Extension, leaving the sidewalk completely unlit after 5:00 PM.',
    imageUrl: '/src/assets/images/issue_broken_streetlight_1794911257530.jpg',
    address: '305 2nd Ave Ext S',
    neighborhood: 'Pioneer Square',
    lat: 47.6004,
    lng: -122.3315,
    reportedAt: '2026-11-11T19:20:00Z',
    reporterName: 'Claire Bennett',
    reporterEmail: 'c.bennett@example.org',
    isOwnReport: false,
    status: 'Resolved',
    priority: 'High',
    assignedCrew: 'City Light Night Ops',
    aiConfidenceDemo: 90.1,
    adminRemarks: 'Replaced faulty photocell relay and two LED drivers.',
    timeline: [
      {
        id: 't-19',
        status: 'New',
        title: 'Report Submitted',
        description: 'Evening safety report logged.',
        timestamp: '2026-11-11T19:20:00Z',
        actor: 'Claire Bennett (Citizen)',
      },
      {
        id: 't-20',
        status: 'Resolved',
        title: 'Lighting Restored',
        description: 'Both fixtures tested and operational.',
        timestamp: '2026-11-12T22:10:00Z',
        actor: 'City Light Night Ops',
      },
    ],
  },
];

export const MONTHLY_TREND_DEMO = [
  { month: 'Jun', reported: 142, resolved: 128 },
  { month: 'Jul', reported: 158, resolved: 144 },
  { month: 'Aug', reported: 171, resolved: 156 },
  { month: 'Sep', reported: 164, resolved: 159 },
  { month: 'Oct', reported: 196, resolved: 172 },
  { month: 'Nov', reported: 214, resolved: 185 },
];

export const AREA_HOTSPOTS_DEMO = [
  {
    area: 'Downtown Core',
    potholes: 48,
    sanitation: 31,
    utilities: 22,
    lighting: 14,
    total: 115,
    resolutionRate: 84,
  },
  {
    area: 'Capitol Hill',
    potholes: 34,
    sanitation: 42,
    utilities: 15,
    lighting: 19,
    total: 110,
    resolutionRate: 79,
  },
  {
    area: 'Belltown',
    potholes: 29,
    sanitation: 27,
    utilities: 12,
    lighting: 24,
    total: 92,
    resolutionRate: 86,
  },
  {
    area: 'Denny Triangle',
    potholes: 41,
    sanitation: 19,
    utilities: 18,
    lighting: 11,
    total: 89,
    resolutionRate: 76,
  },
  {
    area: 'First Hill',
    potholes: 23,
    sanitation: 16,
    utilities: 26,
    lighting: 12,
    total: 77,
    resolutionRate: 88,
  },
  {
    area: 'Pioneer Square',
    potholes: 27,
    sanitation: 24,
    utilities: 14,
    lighting: 18,
    total: 83,
    resolutionRate: 81,
  },
];
