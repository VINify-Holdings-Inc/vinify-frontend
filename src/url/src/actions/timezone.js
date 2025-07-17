import serviceHandler from '../core/services/serviceHandler';

export const GetTimezones = async () => {
  let res = await serviceHandler.get('timezones');
  return res;
};
