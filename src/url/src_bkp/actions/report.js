import serviceHandler from '../core/services/serviceHandler';

export const GetEngagements = async (snippetId, query) => {
  var res = await serviceHandler.get(`reports/${snippetId}?${query}`);
  return res;
};

export const GetPlatforms = async () => {
  var res = await serviceHandler.get(`reports/filter/platforms`);
  return res;
};

export const GetDevices = async () => {
  var res = await serviceHandler.get(`reports/filter/devices`);
  return res;
};
export const GetClients = async () => {
  var res = await serviceHandler.get(`reports/filter/clients`);
  return res;
};