'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function WeatherMap({ farms }: { farms: Array<{ id: string; name: string; latitude: number; longitude: number; risk: string }> }) {
  const center: [number, number] = farms.length
    ? [farms[0].latitude, farms[0].longitude]
    : [-0.8, 37.5];
  const zoom = farms.length === 1 ? 10 : 6;

  return (
    <div className="h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <MapContainer key={`${center[0]}:${center[1]}:${zoom}`} center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="Tiles &copy; Esri - Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {farms.map((farm) => (
          <Marker key={farm.id} position={[farm.latitude, farm.longitude]} icon={markerIcon}>
            <Popup>
              <div className="font-bold">{farm.name}</div>
              <div className="text-xs text-slate-600">Risk: {farm.risk}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
