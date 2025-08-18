"use client";

import { useEffect, useState } from "react";

type UserLocation = {
  lat: number;
  lng: number;
  source: "ip";
  name: string;
};

type GeolocationState = {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
};

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const getLocationByVercel = async () => {
      try {
        const res = await fetch("/api/user-location");
        if (!res.ok) throw new Error("Failed to get IP location");
        const data = await res.json();

        setState({
          location: {
            lat: data.latitude,
            lng: data.longitude,
            source: "ip",
            name: data.city,
          },
          error: null,
          loading: false,
        });
      } catch (err) {
        console.error("Vercel IP location failed", err);
        setState({
          location: null,
          error: "No se pudo determinar la ubicación",
          loading: false,
        });
      }
    };

    getLocationByVercel();
  }, []);

  return state;
}
