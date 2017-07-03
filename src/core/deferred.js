// @flow
/* global Promise:true */

type DeferredCaller = {
  id: number,
  type: string
};

/**
 * @class Deferred
 */
export default class Deferred {
  static instances: Array<Deferred> = [];
  id: number;
  promise: Promise<any>;
  resolve: Function;
  reject: Function;
  /**
   * @param {DeferredCaller} deferredCaller
   * @param {any} data
   * @return {any}
   */
  static runByType = (deferredCaller: DeferredCaller, data: any): any => {
    const { id, type } = deferredCaller;
    const deferred: Deferred = Deferred.instances[id];

    if (!deferred) {
      return false;
    }

    switch (type) {
      case "resolve":
        return deferred.resolve(data);
      case "reject":
        return deferred.reject(data);
      default:
        return Deferred.removeById(id);
    }
  };

  /**
   * @param {number} id
   * @return {boolean}
   */
  static removeById = (id: number): boolean => delete Deferred.instances[id];

  /**
   * @param {Boolean} idRequired
   * @constructor
   */
  constructor(idRequired: boolean = false) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (...args): Promise<any> => {
        resolve(...args);
        Deferred.removeById(this.id);
        return this.promise;
      };
      this.reject = (...args): Promise<any> => {
        reject(...args);
        Deferred.removeById(this.id);
        return this.promise;
      };
    });
    if (idRequired) {
      this.id = Deferred.instances.push(this) - 1;
    }
  }
}
