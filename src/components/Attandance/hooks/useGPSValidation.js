import { validateGPS } from "../services/gpsService";

export const useGPSValidation = () => {
  const checkGPS = async () => await validateGPS();
  return { checkGPS };
};
