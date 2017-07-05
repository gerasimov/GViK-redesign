// @flow
/* global window, CustomEvent:true */
import Deferred from "./../core/deferred";

/**
 * @param {string} eventType
 * @param {any} data
 * @param {any} el
 * @return {any} t
 */
export const triggerCustomEvent = (
    eventType: string,
    data: string,
    el: any = window.document
): any =>
    el.dispatchEvent(
        new CustomEvent(eventType, {
            detail: data
        })
    );

/**
 * @param {string} type
 * @param {Function} handler
 * @param {any} el
 * @return {any}
 */
export const bindCustomEvent = (
    type: string,
    handler: Function,
    el: any = window.document
): any => el.addEventListener(type, handler);

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
