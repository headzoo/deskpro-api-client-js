const axios = require('axios');
const utils = require('./utils');

const API_PATH = '/api/v2';

/**
 * Makes requests to the DeskPRO API.
 */
class DeskPROClient {
  
  /**
   * Constructor
   * 
   * @param {String} helpdeskUrl
   */
  constructor(helpdeskUrl) {
    this.authKey        = null;
    this.authToken      = null;
    this.logger         = null;
    this.defaultHeaders = {};
    this.httpClient     = axios.create({
      baseURL: `${helpdeskUrl}${API_PATH}`
    });
  }
  
  /**
   * @returns {axios}
   */
  getHTTPClient() {
    return this.httpClient;
  }
  
  /**
   * @param {axios} httpClient
   * @returns {DeskPROClient}
   */
  setHTTPClient(httpClient) {
    this.httpClient = httpClient;
    return this;
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
   * @returns {*}
   */
  getDefaultHeaders() {
    return this.defaultHeaders;
  }
  
  /**
   * 
   * @param {Object} defaultHeaders
   * @returns {DeskPROClient}
   */
  setDefaultHeaders(defaultHeaders) {
    this.defaultHeaders = defaultHeaders;
    return this;
  }
  
  /**
   * 
   * @param {Function} logger
   * @returns {DeskPROClient}
   */
  setLogger(logger) {
    this.logger = logger;
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
      url:     endpoint,
      data:    body,
      method:  method,
      headers: this._makeHeaders(headers)
    };
    
    if (body && body.multipart !== undefined) {
      return utils.getFormHeaders(body.multipart)
        .then((formHeaders) => {
          config.data    = body.multipart;
          config.headers = Object.assign({}, config.headers, formHeaders);
          return this._sendRequest(config);
        });
    }
    
    return this._sendRequest(config);
  }
  
  /**
   * @param {*} config
   * @returns {Promise.<T>|*}
   * @private
   */
  _sendRequest(config) {
    if (this.logger) {
      this.logger(`DeskPROClient: ${config.method} ${config.url}: Headers = ${JSON.stringify(config.headers)}`);
    }
    
    return this.httpClient.request(config)
      .then((resp) => {
        if (resp.data === undefined || resp.data.data === undefined) {
          return resp;
        }
        return resp.data;
      })
      .catch((err) => {
        if (err.response.data === undefined) {
          throw err;
        }
        throw err.response.data;
      });
  }
  
  /**
   * 
   * @param {Object} headers
   * @returns {Object}
   * @private
   */
  _makeHeaders(headers = {}) {
    const created = Object.assign({}, this.defaultHeaders, headers);
    if (created['Authorization'] === undefined) {
      if (this.authToken) {
        created['Authorization'] = `token ${this.authToken}`;
      } else if (this.authKey) {
        created['Authorization'] = `key ${this.authKey}`;
      }
    }
    
    return created;
  }
}

module.exports = DeskPROClient;
