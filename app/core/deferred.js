type DeferredCaller = {
  id: number,
  type: string
};
/**
 * @class Deferred
 */
export default class Deferred {
  static instances = [];

  /**
   * @param {DeferredCaller} promiseCaller
   * @param {any} data
   * @return {any}
   */
  static runByType = (promiseCaller: DeferredCaller, data: any) => {
    const {id, type} = promiseCaller;
    const promise = Deferred.instances[id];
    if (!promise) {
      return;
    }
    if (!promise[type]) {
      return Deferred.removeById(id);
    }
    promise[type](data);
  };

  /**
   * @param {number} id
   * @return {boolean}
   */
  static removeById = (id) => delete Deferred.instances[id];

  /**
   * @param {Boolean} idRequired
   * @constructor
   */
  constructor(idRequired: Boolean = true) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (...args) => {
        resolve(...args);
        Deferred.removeById(this.id);
      };
      this.reject = (...args) => {
        reject(...args);
        Deferred.removeById(this.id);
      };
    });
    if(idRequired) {
      this.id = Deferred.instances.push(this) - 1;
    }
  }
}
