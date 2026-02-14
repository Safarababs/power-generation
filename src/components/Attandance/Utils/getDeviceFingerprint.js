import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getDeviceFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  return {
    visitorId: result.visitorId,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };
};
