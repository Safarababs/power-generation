import { validateNetwork } from "../services/networkService";

export const useNetworkValidation = () => {
  const checkNetwork = async () => await validateNetwork();
  return { checkNetwork };
};
