// @flow

export default class OAuth {
  channel: any;

  constructor (channel: any) {
    this.channel = channel
  }

  auth = () =>
    this.channel
      .sendToBackground({
        handler: 'oauth.auth'
      })
      .then(token => {})
      .catch(() => {});
}
