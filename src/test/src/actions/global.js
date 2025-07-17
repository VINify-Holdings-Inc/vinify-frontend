import serviceHandler from '../core/services/serviceHandler';

export const GetPlatforms = async () => {
  var res = await serviceHandler.get(`global/email-platforms`);
  return res;
};