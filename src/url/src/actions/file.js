import axios from 'axios';
import serviceHandler from '../core/services/serviceHandler';
import Config from '../core/config';
import htmlHelper, { toQueryString } from '../core/helpers/htmlHelper';
var config;

let cancelRequest = null;

export const UploadFile = async (file, queryOptions = {}, setState = null) => {
  config = await Config();
  const CancelToken = axios.CancelToken;

  const option = {
    onUploadProgress: (p) => {
      const { loaded, total } = p;
      let per = Math.floor((loaded * 100) / total);
 
        // setState(per);
     if (setState && typeof setState === 'function') {
      setState(per);
    }
    },
    cancelToken: new CancelToken(function executor(c) {
      cancelRequest = c;
    }),
  };
//console.log("test",file);
  var data = new FormData();
  data.append(file.name, file);
  const url = `${config.apiBaseUrl}files?type=${file.fileType}&${toQueryString(queryOptions)}`;
  let res = await axios
    .post(url, data, option)
    .then((res) => {
      const {
        data: { data, message, errors },
        status
      } = res;
      return {
        status: status,
        message: message,
        body: data,
        errors: errors,
        result:
          htmlHelper.getStatus(status) == 200 ||
          htmlHelper.getStatus(status) == 300,
      };
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        return { status: 500, body: error.message, result: false };
      }
      return { status: 500, body: error, result: false };
    });
  return res;
};

export const DeleteFile = async (fileId) => {
  let res = await serviceHandler.delete(`files/${fileId}`);
  return res;
};

export const AbortFetching = async () => {
    //console.log("cancelRequest",cancelRequest);
  //if (cancelRequest) cancelRequest();
  if (cancelRequest){
  let res = await cancelRequest();
  return res;
  }
};

export const GetFiles = async (type) => {
  let res = await serviceHandler.get(`files?type=${type}`);
  return res;
};

export const GetFileUrl = (fileId, typeParam = '') => {
  return `/api/files/${fileId}/url?t=${typeParam}`;
};

export const EncodeVideoFile = async (fileId, { overlay }) => {
  let res = await serviceHandler.post(`videos/${fileId}?overlay=${overlay}`);
  return res;
};
