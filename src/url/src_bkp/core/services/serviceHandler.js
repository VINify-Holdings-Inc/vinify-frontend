import htmlHelper from "../helpers/htmlHelper";
import Config from "../config";
var config;

const serviceHandler = {
  get: async (url, headers = null) => {
  
    return await fetchRequest(url, "GET", null, headers);
  },

  post: async (url, body = null, headers = null, signal = null) => {
    return await fetchRequest(url, "POST", body, headers, signal);
  },

  put: async (url, body = null, headers = null, signal = null) => {
    return await fetchRequest(url, "PUT", body, headers, signal);
  },

  delete: async (url, headers = null) => {
    return await fetchRequest(url, "DELETE", null, headers);
  }
};

const fetchRequest = async (
  url,
  method,
  body = null,
  headers = null,
  signal = null
) => {
  config = await Config();
  url = config.apiBaseUrl + url;
  let request = {
    method: method
  };
  if (signal !== null) {
    request.signal = signal;
  }
  if (headers !== null) {
    request.headers = headers;
  }
  if (body !== null) {
    if (headers === null)
      request.headers = {
        "Content-Type": "application/json"
      };
    request.body = body;
  }
  let status; 
  return fetch(url, request)
    .then(response => {
      status = response.status;
      return response.text().then(text => {
        if (text) {
          try {
            return JSON.parse(text);
          } catch (error) {
            return text;
          }
        } else {
          return {};
        }
      });
    })
    .then(responseBody => {
      return {
        status: status,
        message: responseBody.message,
        body: responseBody.data,
        errors: responseBody.errors,
        result:
          htmlHelper.getStatus(status) == 200 ||
          htmlHelper.getStatus(status) == 300
      };
    })
    .catch(error => {
      return { status: 500, body: error, result: false };
    });
};
export default serviceHandler;
