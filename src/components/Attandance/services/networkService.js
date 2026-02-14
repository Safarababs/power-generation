import { NETWORK_POLICY } from "../constants/networkPolicy";

export const getUserIP = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

export const validateNetwork = async () => {
  const userIP = await getUserIP();
  return NETWORK_POLICY.ALLOWED_IPS.includes(userIP);
};
