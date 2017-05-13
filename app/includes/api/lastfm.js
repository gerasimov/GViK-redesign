import {
  dispatchBackgroundHandler,
  dispatchContentHandler,
} from '../channel';
import waterfall from 'async/waterfall';
import Deferred from '../../core/deferred';
import lastfLoginPage from '../../pages/lastfm/login.html';

/**
 * @class LastFMAPI
 */
export default class LastFMAPI {
  static key = '238a1164222b3ce3f285c5efd733c3ba';

  /**
   * @constructor
   */
  constructor() {

  }

  /**
   * @return {Promise}
   */
  auth = () => {
    const deferred = new Deferred();
    const baseAuthUrl = 'http://www.last.fm/api/auth/';

    const getRedirectPath = (next) => dispatchContentHandler('getPath',
        {path: lastfLoginPage})
        .then((path) => next(null, path))
        .catch((err) => next(err));

    const openAuthPage = (path, next) => dispatchBackgroundHandler(
        'tabs.create',
        {
          arg: {
            url: `${baseAuthUrl}?api_key=${LastFMAPI.key}&cb=${path}`,
          },
        }).then((tab) => next(null, tab))
          .catch((err) => next(err));

    waterfall([
      getRedirectPath,
      openAuthPage,
    ], (err, res) => {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve(res);
    });
    return deferred.promise;
  };

  /**
   *
   */
  send = () => {
  };

  /**
   *
   */
  call = () => {
  };
}
