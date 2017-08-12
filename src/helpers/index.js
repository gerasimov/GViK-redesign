// @flow
/* global window, CustomEvent:true */
import "./babel";
import Deferred from "./../core/deferred";

/**
 *
 */

export const requireScript = async (path: string): Promise<any> => {
  const deferred = new Deferred();
  const script = window.document.createElement("script");
  script.src = path;
  script.onload = deferred.resolve;
  script.onerror = deferred.reject;
  window.document.documentElement.appendChild(script);
  return deferred.promise;
};

export const stringifyParams = params =>
  Object.keys(params).map(k => k + "=" + params[k]).join("&");

export const simpleFetch = (url, params = {}) => {
  const xhr = new XMLHttpRequest();
  const deferred = new Deferred();
  const { method = "GET", headers, body } = params;

  xhr.open(method, url, true);

  Object.keys(headers).forEach(name =>
    xhr.setRequestHeader(name, headers[name])
  );

  xhr.addEventListener("load", () => deferred.resolve(xhr.response));
  xhr.addEventListener("error", () => deferred.reject(xhr.status));

  xhr.send(typeof body === "string" ? body : stringifyParams(body));
  return deferred.promise;
};
