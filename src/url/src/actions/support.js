
import serviceHandler from '../core/services/serviceHandler';

export const SupportRequest = async (data) => {
    var res = await serviceHandler.post(`support`, JSON.stringify(data));
    return res;
};