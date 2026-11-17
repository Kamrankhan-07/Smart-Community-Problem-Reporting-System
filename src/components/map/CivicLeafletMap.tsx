import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Compass, Minus, Plus } from 'lucide-react';
import { CivicComplaint } from '../../types/civic';
import { formatShortDate, getMarkerHexColor, getMarkerTone } from '../../utils/geo';

interface CivicLeafletMapProps {
  complaints: CivicComplaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (complaint: CivicComplaint) => void;
  onInspectComplaint?: (complaintId: string) => void;
  interactivePinMode?: boolean;
  pinPosition?: { lat: number; lng: number };
  onPinMove?: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  heightClass?: string;
  showLegend?: boolean;
  showControls?: boolean;
}

const DEFAULT_CENTER: [number, number] = [47.6115, -122.3315];

function createMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 30 : 22;
  const ring = isSelected ? '0 0 0 4px rgba(15, 41, 66, 0.25)' : '0 2px 6px rgba(15, 23, 42, 0.35)';
  return L.divIcon({
    className: 'custom-civic-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2.5px solid #ffffff;box-shadow:${ring};display:flex;align-items:center;justify-content:center;transition:transform 150ms ease;"><div style="width:${Math.round(size * 0.32)}px;height:${Math.round(size * 0.32)}px;border-radius:9999px;background:#ffffff;"></div></div>`,
  });
}

function createDraftPinIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-civic-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:24px;height:24px;border-radius:9999px;background:#0F2942;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(15,41,66,0.45);display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;border-radius:9999px;background:#0D9488;"></div>
      </div>
      <div style="width:2px;height:6px;background:#0F2942;margin-top:-1px;"></div>
    </div>`,
  });
}

export const CivicLeafletMap: React.FC<CivicLeafletMapProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onInspectComplaint,
  interactivePinMode = false,
  pinPosition,
  onPinMove,
  center = DEFAULT_CENTER,
  zoom = 14,
  heightClass = 'h-[420px]',
  showLegend = true,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const draftMarkerRef = useRef<L.Marker | null>(null);
  const [tileNotice, setTileNotice] = useState(false);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }
    );

    tileLayer.on('tileerror', () => {
      setTileNotice(true);
    });

    tileLayer.addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    // Ensure proper size calculation inside dynamic panels
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      draftMarkerRef.current = null;
    };
  }, []);

  // Handle interactive pin-drop clicks
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !interactivePinMode || !onPinMove) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onPinMove(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [interactivePinMode, onPinMove]);

  // Render/update draft pin marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!interactivePinMode || !pinPosition) {
      if (draftMarkerRef.current) {
        draftMarkerRef.current.remove();
        draftMarkerRef.current = null;
      }
      return;
    }

    if (!draftMarkerRef.current) {
      const marker = L.marker([pinPosition.lat, pinPosition.lng], {
        icon: createDraftPinIcon(),
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onPinMove) {
          onPinMove(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
        }
      });

      draftMarkerRef.current = marker;
    } else {
      draftMarkerRef.current.setLatLng([pinPosition.lat, pinPosition.lng]);
    }
  }, [interactivePinMode, pinPosition, onPinMove]);

  // Render issue markers
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    complaints.forEach((complaint) => {
      const tone = getMarkerTone(complaint);
      const color = getMarkerHexColor(tone);
      const isSelected = complaint.id === selectedComplaintId;

      const marker = L.marker([complaint.lat, complaint.lng], {
        icon: createMarkerIcon(color, isSelected),
        zIndexOffset: isSelected ? 500 : 0,
      });

      const popupEl = document.createElement('div');
      popupEl.className = 'bg-white text-slate-900 overflow-hidden';

      const statusTextColor =
        complaint.status === 'Resolved'
          ? '#047857'
          : complaint.priority === 'High'
            ? '#B91C1C'
            : '#B45309';

      popupEl.innerHTML = `
        <div style="position:relative;height:112px;background:#f1f5f9;overflow:hidden;">
          <img src="${complaint.imageUrl}" alt="${complaint.title}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="padding:12px 14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--font-mono);font-size:11px;color:#64748b;">${complaint.id}</span>
            <span style="font-size:11px;font-weight:600;color:${statusTextColor};">${complaint.status}</span>
          </div>
          <div style="font-family:var(--font-display);font-size:14px;font-weight:600;color:#0F2942;line-height:1.3;margin-bottom:4px;">
            ${complaint.category}
          </div>
          <div style="font-size:12px;color:#475569;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${complaint.address} · ${formatShortDate(complaint.reportedAt)}
          </div>
          ${
            onInspectComplaint
              ? `<button data-inspect-id="${complaint.id}" style="width:100%;padding:7px 12px;background:#0F2942;color:#ffffff;font-size:12px;font-weight:600;border-radius:8px;border:none;cursor:pointer;">View Full Report</button>`
              : ''
          }
        </div>
      `;

      if (onInspectComplaint) {
        const btn = popupEl.querySelector('[data-inspect-id]');
        if (btn) {
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            onInspectComplaint(complaint.id);
          });
        }
      }

      marker.bindPopup(popupEl, { closeButton: true });

      marker.on('click', () => {
        if (onSelectComplaint) {
          onSelectComplaint(complaint);
        }
      });

      marker.addTo(layer);

      if (isSelected) {
        map.panTo([complaint.lat, complaint.lng], { animate: true });
        marker.openPopup();
      }
    });
  }, [complaints, selectedComplaintId, onSelectComplaint, onInspectComplaint]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCenter = () => {
    if (pinPosition && interactivePinMode) {
      mapRef.current?.setView([pinPosition.lat, pinPosition.lng], 15, { animate: true });
    } else {
      mapRef.current?.setView(center, zoom, { animate: true });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-100`}>
      <div ref={containerRef} className="w-full h-full z-0" />

      {tileNotice && (
        <div className="pointer-events-none absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 shadow-sm">
          Offline street grid mode active · Coordinates & markers remain interactive
        </div>
      )}

      {interactivePinMode && (
        <div className="pointer-events-none absolute top-3 left-3 z-[400] bg-[#0F2942]/90 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm">
          Click anywhere on the map or drag the pin to adjust exact location
        </div>
      )}

      {showControls && (
        <div className="absolute top-3 right-3 z-[400] flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in map"
            className="p-2 text-slate-700 hover:bg-slate-50 hover:text-[#0F2942] border-b border-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out map"
            className="p-2 text-slate-700 hover:bg-slate-50 hover:text-[#0F2942] border-b border-slate-200 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetCenter}
            aria-label="Reset map view"
            className="p-2 text-slate-700 hover:bg-slate-50 hover:text-[#0F2942] transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex flex-wrap items-center gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] border border-white shadow-xs inline-block" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D97706] border border-white shadow-xs inline-block" />
            <span>Medium / Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#059669] border border-white shadow-xs inline-block" />
            <span>Resolved</span>
          </div>
        </div>
      )}
    </div>
  );
};
