import { GPS_POLICY } from "../constants/gpsPoilicy";

const toRad = (deg) => deg * (Math.PI / 180);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true },
    );
  });
};

export const validateGPS = async () => {
  const coords = await getCurrentPosition();
  const distance = calculateDistance(
    coords.latitude,
    coords.longitude,
    GPS_POLICY.latitude,
    GPS_POLICY.longitude,
  );
  return distance <= GPS_POLICY.radius;
};
