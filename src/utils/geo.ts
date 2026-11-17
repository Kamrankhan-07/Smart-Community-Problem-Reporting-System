import { CivicComplaint, PriorityLevel } from '../types/civic';

/**
 * Computes Haversine distance in meters between two WGS84 coordinates.
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}

export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getMarkerTone(complaint: CivicComplaint): 'resolved' | 'high' | 'medium' {
  if (complaint.status === 'Resolved') return 'resolved';
  if (complaint.priority === 'High') return 'high';
  return 'medium';
}

export function getMarkerHexColor(tone: 'resolved' | 'high' | 'medium'): string {
  switch (tone) {
    case 'resolved':
      return '#059669'; // Emerald
    case 'high':
      return '#DC2626'; // Crimson
    case 'medium':
      return '#D97706'; // Amber/Orange
  }
}

export function getPriorityLabel(priority: PriorityLevel): string {
  return `${priority} Priority`;
}
