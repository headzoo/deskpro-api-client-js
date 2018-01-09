const Response = require('./Response');
const axios = require('axios');

const API_PATH = '/api/v2';

class DeskPROClient {
  
  /**
   * Constructor
   * 
   * @param {String} helpdeskUrl
   */
  constructor(helpdeskUrl) {
    this.helpdeskUrl = helpdeskUrl;
    this.authKey     = null;
    this.authToken   = null;
  }
  
  /**
   *
   * @param {Number} personId
   * @param {String} token
   * @returns {DeskPROClient}
   */
  setAuthToken(personId, token) {
    this.authToken = `${personId}:${token}`;
    return this;
  }
  
  /**
   * 
   * @param {Number} personId
   * @param {String} key
   * @returns {DeskPROClient}
   */
  setAuthKey(personId, key) {
    this.authKey = `${personId}:${key}`;
    return this;
  }
  
  /**
   * 
   * @param {String} endpoint
   * @returns {Promise.<T>|*}
   */
  get(endpoint) {
    return this.request('GET', endpoint);
  }
  
  /**
   * 
   * @param {String} endpoint
   * @param {*} body
   * @returns {Promise.<T>|*}
   */
  post(endpoint, body = null) {
    return this.request('POST', endpoint, body);
  }
  
  /**
   *
   * @param {String} endpoint
   * @param {*} body
   * @returns {Promise.<T>|*}
   */
  put(endpoint, body = null) {
    return this.request('PUT', endpoint, body);
  }
  
  /**
   *
   * @param {String} endpoint
   * @returns {Promise.<T>|*}
   */
  del(endpoint) {
    return this.request('DELETE', endpoint);
  }
  
  /**
   * 
   * @param {String} method
   * @param {String} endpoint
   * @param {*} body
   * @param {Object} headers
   * @returns {Promise.<T>|*}
   */
  request(method, endpoint, body = null, headers = {}) {
    const config = {
      url: this._makeUrl(endpoint),
      method: method,
      data: body,
      headers: this._makeHeaders(headers)
    };
    
    return axios.request(config)
      .then((resp) => {
        if (resp.data === undefined || resp.data.data === undefined) {
          return resp;
        }
        return new Response(resp.data.data, resp.data.meta, resp.data.linked);
      })
      .catch((err) => {
        throw err.response.data;
      });
  }
  
  /**
   * @param {String} endpoint
   * @returns {String}
   * @private
   */
  _makeUrl(endpoint) {
    return `${this.helpdeskUrl}${API_PATH}/${endpoint.replace(/^\/+|\/+$/g, '')}`;
  }
  
  /**
   * 
   * @param {Object} headers
   * @returns {Object}
   * @private
   */
  _makeHeaders(headers) {
    if (this.authToken) {
      headers['Authorization'] = `token ${this.authToken}`;
    } else if (this.authKey) {
      headers['Authorization'] = `key ${this.authKey}`;
    }
    
    return headers;
  }
}

module.exports = DeskPROClient;