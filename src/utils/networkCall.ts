import {baseURL} from './constants';
import Storage from './Storage';

type IResponseType = 'json' | 'text' | 'blob';
type IResolve = {
  response: any;
  statusCode: number | null;
  error: string | unknown | null;
  errorDetails: unknown | null;
};
type IMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type UrlBody = {
  url: string;
  params?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
};

const makeEndpointUrl = (url: UrlBody) => {
  let _url = url.url;
  for (const param in url.params) {
    _url = _url.replace(':' + param, `${url.params[param]}`);
  }

  if (url.queryParams) {
    let queryParams = '?';
    for (const queryParam in url.queryParams) {
      queryParams += `${queryParam}=${url.queryParams[queryParam]}&`;
    }
    _url += queryParams;
  }
  return _url;
};

const resolve = async (
  promise: () => Promise<{response: any; statusCode: number} | unknown>,
) => {
  const resolved: IResolve = {
    response: null,
    error: null,
    statusCode: null,
    errorDetails: null,
  };
  try {
    const result = await promise();
    if (
      result &&
      typeof result === 'object' &&
      'response' in result &&
      'statusCode' in result
    ) {
      const {response, statusCode, error} = result as {
        response: any;
        error: any;
        statusCode: number;
      };
      resolved.response = response;
      resolved.statusCode = statusCode;
      resolved.error = error;
    } else {
      // eslint-disable-next-line
      throw {
        statusCode: (result as any)?.statusCode,
        errorDetails: (result as any)?.error,
      };
    }
  } catch (error: any) {
    resolved.error = 'Something went wrong...';
    resolved.errorDetails = error;
    if (error instanceof Response) {
      resolved.statusCode = error.status;
    }
    if (error?.errorDetails) {
      resolved.errorDetails = error?.errorDetails;
    }
    if (error?.statusCode) {
      resolved.statusCode = error?.statusCode;
    }
  }

  return resolved;
};

const networkCall = async (
  url: string | UrlBody,
  method: IMethod = 'GET',
  body?: RequestInit['body'],
  headers?: RequestInit['headers'],
  responseType: IResponseType = 'json',
) => {
  const makeCall = async () => {
    let statusCode: number | null = null;
    try {
      const _url = typeof url === 'string' ? url : makeEndpointUrl(url);
      const fullUrl = /(http(s?)):\/\//i.test(_url)
        ? _url
        : baseURL + '/' + _url;
      const token = await Storage.get('token');
      let defaultHeaders = {
        'Content-Type':
          body instanceof FormData ? 'multipart/form-data' : 'application/json',
        ...(token && {token}),
        ...headers,
      };
      if (defaultHeaders && defaultHeaders['Content-Type'] === 'null') {
        delete (defaultHeaders as {[key: string]: string})['Content-Type'];
      }
      const response = await fetch(fullUrl, {
        method,
        headers: defaultHeaders,
        ...(body && {body}),
      });
      statusCode = response.status;
      const responseData = await response[responseType]();
      return {
        response: responseData,
        statusCode,
      };
    } catch (error) {
      return {error, statusCode};
    }
  };
  return await resolve(makeCall);
};

export default networkCall;
