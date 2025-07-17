import serviceHandler from '../core/services/serviceHandler';

export const GetCountries = async () => {
  let res = await serviceHandler.get('countries');
  return res;
};
