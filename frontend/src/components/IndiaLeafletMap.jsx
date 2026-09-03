import React, { useEffect, useRef, useState } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Users, Building2, Briefcase } from 'lucide-react';

// Indian state stats & geo-coordinates
export const INDIA_STATE_DATA = [
  { id: 'UP', name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, count: 2845, centres: 8, placements: 523, density: '> 2,000', color: '#F72570', radius: 34 },
  { id: 'MH', name: 'Maharashtra', lat: 19.7515, lng: 75.7139, count: 1892, centres: 6, placements: 418, density: '1,000 - 2,000', color: '#E02670', radius: 28 },
  { id: 'KA', name: 'Karnataka', lat: 15.3173, lng: 75.7139, count: 1256, centres: 5, placements: 312, density: '1,000 - 2,000', color: '#E02670', radius: 24 },
  { id: 'DL', name: 'Delhi NCR', lat: 28.7041, lng: 77.1025, count: 1120, centres: 4, placements: 340, density: '1,000 - 2,000', color: '#E02670', radius: 22 },
  { id: 'MP', name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, count: 965, centres: 4, placements: 298, density: '500 - 1,000', color: '#FB7185', radius: 20 },
  { id: 'RJ', name: 'Rajasthan', lat: 27.0238, lng: 74.2179, count: 842, centres: 3, placements: 276, density: '500 - 1,000', color: '#FB7185', radius: 19 },
  { id: 'GJ', name: 'Gujarat', lat: 22.2587, lng: 71.1924, count: 780, centres: 3, placements: 180, density: '500 - 1,000', color: '#FB7185', radius: 18 },
  { id: 'TN', name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, count: 640, centres: 2, placements: 150, density: '500 - 1,000', color: '#FB7185', radius: 16 },
  { id: 'TG', name: 'Telangana', lat: 18.1124, lng: 79.0193, count: 520, centres: 2, placements: 120, density: '500 - 1,000', color: '#FB7185', radius: 15 },
  { id: 'WB', name: 'West Bengal', lat: 22.9868, lng: 87.8550, count: 420, centres: 1, placements: 90, density: '100 - 500', color: '#FECDD3', radius: 13 },
  { id: 'BR', name: 'Bihar', lat: 25.0961, lng: 85.3131, count: 380, centres: 1, placements: 70, density: '100 - 500', color: '#FECDD3', radius: 12 },
  { id: 'PB', name: 'Punjab', lat: 31.1471, lng: 75.3412, count: 290, centres: 1, placements: 55, density: '100 - 500', color: '#FECDD3', radius: 11 },
  { id: 'KL', name: 'Kerala', lat: 10.8505, lng: 76.2711, count: 180, centres: 1, placements: 40, density: '100 - 500', color: '#FECDD3', radius: 10 },
  { id: 'OD', name: 'Odisha', lat: 20.9517, lng: 85.0985, count: 150, centres: 1, placements: 30, density: '100 - 500', color: '#FECDD3', radius: 9 },
  { id: 'AS', name: 'Assam', lat: 26.2006, lng: 92.9376, count: 90, centres: 1, placements: 15, density: '< 100', color: '#FFF1F2', radius: 8 },
];

export default function IndiaLeafletMap({
  height = '240px',
  interactive = true,
  onSelectState,
  selectedStateId
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeState, setActiveState] = useState(null);

  // Load Leaflet Script and CSS dynamically
  useEffect(() => {
    // 1. Inject Leaflet CSS if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS if not already present
    if (!window.L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setMapLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapContainerRef.current) return;

    // Clean up previous instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const L = window.L;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 79.5],
      zoom: 4.4,
      minZoom: 3.5,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
    });

    mapInstanceRef.current = map;

    // Add CartoDB Positron / OpenStreetMap Clean Light Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Layer group for density circles and pins
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Render State Density Circles with Pulse & Popups
    INDIA_STATE_DATA.forEach((state) => {
      // 1. Background Halo / Glow for Density
      const glowCircle = L.circleMarker([state.lat, state.lng], {
        radius: state.radius + 6,
        fillColor: state.color,
        fillOpacity: 0.15,
        stroke: false,
      }).addTo(markersGroup);

      // 2. Main Density Circle
      const circle = L.circleMarker([state.lat, state.lng], {
        radius: state.radius,
        fillColor: state.color,
        fillOpacity: 0.75,
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.9,
      }).addTo(markersGroup);

      // 3. Custom HTML Label Icon
      const labelIcon = L.divIcon({
        className: 'custom-state-label',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
            pointer-events: none;
            transform: translate(-50%, -50%);
          ">
            <span style="
              font-size: 10px;
              font-weight: 800;
              color: #FFFFFF;
              text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            ">${state.id}</span>
            <span style="
              font-size: 9px;
              font-weight: 700;
              color: #FFFFFF;
              text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            ">${state.count > 999 ? (state.count / 1000).toFixed(1) + 'k' : state.count}</span>
          </div>
        `,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      });

      L.marker([state.lat, state.lng], { icon: labelIcon, interactive: false }).addTo(markersGroup);

      // Popup Content with stats
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 170px; color: #0F172A;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-weight: 800; font-size: 13px; color: #0F172A;">${state.name}</span>
            <span style="background: #FFF0F5; color: #F72570; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 999px; border: 1px solid rgba(247,37,112,0.3);">${state.density}</span>
          </div>
          <div style="font-size: 11px; display: grid; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B; font-weight: 600;">Candidates:</span>
              <span style="font-weight: 800; color: #F72570;">${state.count.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B; font-weight: 600;">Training Centres:</span>
              <span style="font-weight: 700;">${state.centres} centres</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B; font-weight: 600;">Placements:</span>
              <span style="font-weight: 700; color: #059669;">${state.placements} placed</span>
            </div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        closeButton: false,
        offset: [0, -10],
        className: 'custom-leaflet-popup',
      });

      circle.on('mouseover', () => {
        circle.setStyle({ fillOpacity: 0.95, weight: 3 });
        circle.openPopup();
        setActiveState(state);
      });

      circle.on('mouseout', () => {
        circle.setStyle({ fillOpacity: 0.75, weight: 2 });
        circle.closePopup();
      });

      circle.on('click', () => {
        setActiveState(state);
        if (onSelectState) onSelectState(state);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, interactive]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.setView([22.8, 79.5], 4.4);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height }}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Buttons */}
      {interactive && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs">
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition border-t border-slate-100"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Density Legend Overlay */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs text-[9.5px]">
        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F72570]" />
          <span>Candidate Density</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F72570]" />
            <span>&gt; 2,000</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E02670]" />
            <span>1k-2k</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
            <span>500-1k</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FECDD3]" />
            <span>100-500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
