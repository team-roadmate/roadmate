// hooks/useCurrentLocation.ts
import * as Location from "expo-location";
import { useEffect, useState } from "react";

type SimpleCoords = {
  lat: number;
  lng: number;
} | null;

// ✅ default export + lat/lng 형태로 변환
export default function useCurrentLocation(): SimpleCoords {
  const [coords, setCoords] = useState<SimpleCoords>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setCoords({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  return coords;
}
