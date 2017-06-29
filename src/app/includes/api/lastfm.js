// @flow
import { dispatchBackgroundHandler, dispatchContentHandler } from '../channel'
import md5 from 'md5'
import lastfLoginPage from './../../pages/lastfm/login.html'

/**
 * @class LastFMAPI
 */
export default class LastFMAPI {
  static key = 'fe8b52c2ba5ef2c9e7c18a8064fbd92d';
  static secret = 'e28079729f31ca7e1cab7ba3dee55b71';
  static authPath = 'http://www.last.fm/api/auth/';
  static getSessionKey = () => `lastfm${window.vk.id}`;
  /**
   * @return {Promise}
   */
  auth = async () => {
    const path = await dispatchContentHandler('getPath', {
      path: lastfLoginPage
    })
    let token
    try {
      token = (await dispatchBackgroundHandler('oauth', {
        args: [`${LastFMAPI.authPath}?api_key=${LastFMAPI.key}&cb=${path}`]
      })).token
    } catch (e) {
      return null
    }

    let session
    try {
      session = (await this.methods.auth.getSession(token)).session
    } catch (e) {
      return null
    }
    await dispatchContentHandler('sync.set', {
      arg: { [LastFMAPI.getSessionKey()]: session }
    })

    return session
  };

  send = async (params: { [string]: any }) =>
    window
      .fetch('https://ws.audioscrobbler.com/2.0/', {
        body: Object.keys(params).map(k => k + '=' + params[k]).join('&'),
        method: 'POST',
        cache: 'default'
      })
      .then(r => r.json());

  getSignature (params: { [string]: any }): string {
    return md5(
      Object.keys(params).map(key => key + params[key]).sort().join('') +
        LastFMAPI.secret
    )
  }
  async getSession (
    isAuthMethod: boolean = false,
    userKey: string = LastFMAPI.getSessionKey()
  ) {
    try {
      return await dispatchContentHandler('sync.get', {
        arg: userKey
      }).then(res => {
        const session = res[userKey]
        if (session) {
          return session
        }

        return isAuthMethod ? session : this.auth()
      })
    } catch (e) {
      return null
    }
  }

  async call (
    method: string,
    data: { [string]: any },
    isPost: boolean = true,
    isAuthMethod: boolean = false
  ): Promise<any> {
    const extendedData: { [string]: any } = {
      ...data,
      method,
      lang: 'ru',
      api_key: LastFMAPI.key
    }
    const session = await this.getSession(isAuthMethod)
    if (session) {
      extendedData.sk = session.key
    }
    extendedData.api_sig = this.getSignature(extendedData)
    extendedData.format = 'json'
    try {
      return await this.send(extendedData)
    } catch (e) {
      return null
    }
  }
  methods = {
    auth: {
      getSession: async (token: string): Promise<any> => {
        try {
          return await this.call('auth.getSession', { token }, false, true)
        } catch (e) {
          return null
        }
      }
    }
  };
}
