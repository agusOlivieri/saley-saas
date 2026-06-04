'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Crosshair } from 'lucide-react';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  // Coordenadas genéricas iniciales (ej. Buenos Aires)
  const [viewState, setViewState] = useState({
    longitude: -58.3816,
    latitude: -34.6037,
    zoom: 13
  });

  const [marker, setMarker] = useState({
    longitude: -58.3816,
    latitude: -34.6037
  });

  const [isLocating, setIsLocating] = useState(false);

  // Intentar obtener la ubicación actual al montar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 15 }));
          setMarker({ latitude, longitude });
          onLocationChange(latitude, longitude);
        },
        (error) => {
          console.log('No se pudo obtener la ubicación o el usuario la denegó.', error);
          // Usa la ubicación genérica por defecto, no hacemos nada.
          onLocationChange(-34.6037, -58.3816);
        }
      );
    } else {
      onLocationChange(-34.6037, -58.3816);
    }
  }, [onLocationChange]);

  const onMarkerDragEnd = useCallback((event: any) => {
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    setMarker({ longitude: lng, latitude: lat });
    onLocationChange(lat, lng);
  }, [onLocationChange]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 15 }));
        setMarker({ latitude, longitude });
        onLocationChange(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        alert('No se pudo acceder a tu ubicación.');
        setIsLocating(false);
      }
    );
  };

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-200">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />

        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          draggable
          onDragEnd={onMarkerDragEnd}
        >
          <div className="w-8 h-8 bg-blue-950 rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
            <MapPin size={16} className="text-white" />
          </div>
        </Marker>
      </Map>

      {/* Botón flotante para mi ubicación actual */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md border border-gray-100 text-blue-900 hover:bg-gray-50 transition-colors z-10"
        title="Mi ubicación actual"
      >
        <Crosshair size={20} className={isLocating ? "animate-spin text-gray-400" : ""} />
      </button>

      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-[10px] font-semibold text-gray-700 pointer-events-none">
        Arrastra el marcador a tu local
      </div>
    </div>
  );
}
