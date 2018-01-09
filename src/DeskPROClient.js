const axios = require('axios');
const utils = require('./utils');

const API_PATH       = '/api/v2';
const AUTH_HEADER    = 'Authorization';
const AUTH_TOKEN_KEY = 'token';
const AUTH_KEY_KEY   = 'key';
const LOG_PREFIX     = 'DeskPROClient';

/**
 * Makes requests to the DeskPRO API.
 */
class DeskPROClient {
  
  /**
   * Constructor
   * 
   * @param {String} helpdeskUrl The base URL to the DeskPRO instance
   * @param {Function} logger    A function which gets called to log requests 
   */
  constructor(helpdeskUrl, logger = null) {
    this.authKey        = null;
    this.authToken      = null;
    this.defaultHeaders = {};
    this.logger         = logger;
    this.httpClient     = axios.create({
      baseURL: `${helpdeskUrl}${API_PATH}`
    });
  }
  
  /**
   * Returns the HTTP client used to make API requests
   * 
   * @returns {axios}
   */
  getHTTPClient() {
    return this.httpClient;
  }
  
  /**
   * Sets the HTTP client used to make API requests
   * 
   * @param {axios} httpClient
   * @returns {DeskPROClient}
   */
  setHTTPClient(httpClient) {
    this.httpClient = httpClient;
    return this;
  }
  
  /**
   * Sets the person ID and authentication token
   * 
   * @param {Number} personId The ID of the person being authenticated
   * @param {String} token    The authentication token
   * @returns {DeskPROClient}
   */
  setAuthToken(personId, token) {
    this.authToken = `${personId}:${token}`;
    return this;
  }
  
  /**
   * Sets the person ID and authentication key
   * 
   * @param {Number} personId The ID of the person being authenticated
   * @param {String} key      The authentication key
   * @returns {DeskPROClient}
   */
  setAuthKey(personId, key) {
    this.authKey = `${personId}:${key}`;
    return this;
  }
  
  /**
   * Returns the headers sent with each request
   * 
   * @returns {*}
   */
  getDefaultHeaders() {
    return this.defaultHeaders;
  }
  
  /**
   * Sets the headers sent with each request
   * 
   * @param {Object} defaultHeaders The headers to send
   * @returns {DeskPROClient}
   */
  setDefaultHeaders(defaultHeaders) {
    this.defaultHeaders = defaultHeaders;
    return this;
  }
  
  /**
   * Sets the function used for request logging
   * 
   * @param {Function} logger A function which gets called to log requests
   * @returns {DeskPROClient}
   */
  setLogger(logger) {
    this.logger = logger;
    return this;
  }
  
  /**
   * Sends a GET request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @returns {Promise.<T>}
   */
  get(endpoint) {
    return this.request('GET', endpoint);
  }
  
  /**
   * Sends a POST request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @returns {Promise.<T>}
   */
  post(endpoint, body = null) {
    return this.request('POST', endpoint, body);
  }
  
  /**
   * Sends a PUT request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @returns {Promise.<T>}
   */
  put(endpoint, body = null) {
    return this.request('PUT', endpoint, body);
  }
  
  /**
   * Sends a DELETE request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @returns {Promise.<T>}
   */
  del(endpoint) {
    return this.request('DELETE', endpoint);
  }
  
  /**
   * Sends a request to the API
   * 
   * @param {String} method   The HTTP method to use, e.g. 'GET', 'POST', etc
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @param {Object} headers  Additional headers to send with the request
   * @returns {Promise.<T>}
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
   * @param {*} config The request configuration
   * @returns {Promise.<T>}
   * @private
   */
  _sendRequest(config) {
    if (this.logger) {
      this.logger(`${LOG_PREFIX}: ${config.method} ${config.url}: Headers = ${JSON.stringify(config.headers)}`);
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
   * @param {Object} headers Additional headers to add
   * @returns {Object}
   * @private
   */
  _makeHeaders(headers = {}) {
    const created = Object.assign({}, this.defaultHeaders, headers);
    if (created[AUTH_HEADER] === undefined) {
      if (this.authToken) {
        created[AUTH_HEADER] = `${AUTH_TOKEN_KEY} ${this.authToken}`;
      } else if (this.authKey) {
        created[AUTH_HEADER] = `${AUTH_KEY_KEY} ${this.authKey}`;
      }
    }
    
    return created;
  }
}

module.exports = DeskPROClient;
