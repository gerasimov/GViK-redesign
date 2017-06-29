// @flow
/* global window, CustomEvent:true */
import Deferred from './../core/deferred'

/**
 * @param {any} el
 * @param {string} eventType
 * @param {any} data
 * @return {any}
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
  )

/**
 * @param {any} el
 * @param {string} type
 * @param {Function} handler
 * @return {any}
 */
export const bindCustomEvent = (
  type: string,
  handler: Function,
  el: any = window.document
): any => el.addEventListener(type, handler)

/**
 *
 */

export const requireScript = (path: string): Promise<any> => {
  const deferred = new Deferred()
  const script = window.document.createElement('script')
  script.src = path
  script.onload = deferred.resolve
  script.onerror = deferred.reject
  window.document.documentElement.appendChild(script)
  return deferred.promise
}
