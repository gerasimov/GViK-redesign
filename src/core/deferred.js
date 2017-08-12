// @flow

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
    if (type === "resolve") {
      return deferred.resolve(data);
    } else if (type === "reject") {
      return deferred.reject(data);
    } else {
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

/**
 *
 * @param {Function} fn
 * @return {Promise}
 */
export function promisify(fn: Function) {
  return ({ args }: { args: Array<any> }) => {
    const deferred = new Deferred();
    fn(...args, deferred.resolve);
    return deferred.promise;
  };
}
