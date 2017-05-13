/**
 * @param {any} el
 * @param {string} eventType
 * @param {any} data
 * @return {any}
 */
export const triggerCustomEvent = (
    el: any = document,
    eventType: string,
    data: any) => el.dispatchEvent(new CustomEvent(eventType, {
  detail: data,
}));

/**
 * @param {any} el
 * @param {string} type
 * @param {Function} handler
 * @return {any}
 */
export const bindCustomEvent = (
    el: any = document,
    type: string,
    handler: Function) => el.addEventListener(type, handler);
