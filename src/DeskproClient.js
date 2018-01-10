/*
 * DeskPRO (r) has been developed by DeskPRO Ltd. https://www.deskpro.com/
 * a British company located in London, England.
 *
 * All source code and content Copyright (c) 2017, DeskPRO Ltd.
 *
 * The license agreement under which this software is released
 * can be found at https://www.deskpro.com/eula/
 *
 * By using this software, you acknowledge having read the license
 * and agree to be bound thereby.
 *
 * Please note that DeskPRO is not free software. We release the full
 * source code for our software because we trust our users to pay us for
 * the huge investment in time and energy that has gone into both creating
 * this software and supporting our customers. By providing the source code
 * we preserve our customers' ability to modify, audit and learn from our
 * work. We have been developing DeskPRO since 2001, please help us make it
 * another decade.
 *
 * Like the work you see? Think you could make it better? We are always
 * looking for great developers to join us: http://www.deskpro.com/jobs/
 *
 * ~ Thanks, Everyone at Team DeskPRO
 */

const axios = require('axios');
const utils = require('./utils');

const API_PATH       = '/api/v2';
const AUTH_HEADER    = 'Authorization';
const AUTH_TOKEN_KEY = 'token';
const AUTH_KEY_KEY   = 'key';
const LOG_PREFIX     = 'DeskproClient';

/**
 * Makes requests to the Deskpro API.
 */
class DeskproClient {
  
  /**
   * Constructor
   * 
   * @param {String}   helpdeskUrl The base URL to the DeskPRO instance
   * @param {axios}    httpClient  The HTTP client used to make API requests
   * @param {Function} logger      A function which gets called to log requests 
   */
  constructor(helpdeskUrl, httpClient = null, logger = null) {
    this.authKey          = null;
    this.authToken        = null;
    this.lastHTTPRequest  = null;
    this.lastHTTPResponse = null;
    this.lastHTTPRequestException = null;
    this.defaultHeaders   = {};
    this.logger           = logger;
    this.httpClient       = httpClient || axios.create({
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
   * @returns {DeskproClient}
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
   * @returns {DeskproClient}
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
   * @returns {DeskproClient}
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
   * @returns {DeskproClient}
   */
  setDefaultHeaders(defaultHeaders) {
    this.defaultHeaders = defaultHeaders;
    return this;
  }
  
  /**
   * Sets the function used for request logging
   * 
   * @param {Function} logger A function which gets called to log requests
   * @returns {DeskproClient}
   */
  setLogger(logger) {
    this.logger = logger;
    return this;
  }
  
  /**
   * Returns the request used during the last operation
   * 
   * @returns {*}
   */
  getLastHTTPRequest() {
    return this.lastHTTPRequest;
  }
  
  /**
   * Returns the response received from the last operation
   * 
   * @returns {*}
   */
  getLastHTTPResponse() {
    return this.lastHTTPResponse;
  }
  
  /**
   * Returns any exception created during the last operation
   * 
   * @returns {*}
   */
  getLastHTTPRequestException() {
    return this.lastHTTPRequestException;
  }
  
  /**
   * Sends a GET request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {Object} params   Query and placeholder params
   * 
   * @returns {Promise.<T>}
   */
  get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params);
  }
  
  /**
   * Sends a POST request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @param {Object} params   Query and placeholder params
   * 
   * @returns {Promise.<T>}
   */
  post(endpoint, body = null, params = {}) {
    return this.request('POST', endpoint, body, params);
  }
  
  /**
   * Sends a PUT request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @param {Object} params   Query and placeholder params
   * 
   * @returns {Promise.<T>}
   */
  put(endpoint, body = null, params = {}) {
    return this.request('PUT', endpoint, body, params);
  }
  
  /**
   * Sends a DELETE request to the API
   * 
   * @param {String} endpoint The API endpoint (path)
   * @param {Object} params   Query and placeholder params
   * 
   * @returns {Promise.<T>}
   */
  del(endpoint, params = {}) {
    return this.request('DELETE', endpoint, null, params);
  }
  
  /**
   * Sends a request to the API
   * 
   * @param {String} method   The HTTP method to use, e.g. 'GET', 'POST', etc
   * @param {String} endpoint The API endpoint (path)
   * @param {*}      body     Values sent in the request body
   * @param {Object} params   Query and placeholder params
   * @param {Object} headers  Additional headers to send with the request
   * 
   * @returns {Promise.<T>}
   */
  request(method, endpoint, body = null, params = {}, headers = {}) {
    const config = {
      url:     utils.interpolateURL(endpoint, params),
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
   * 
   * @returns {Promise.<T>}
   */
  _sendRequest(config) {
    const self = this;
    this.lastHTTPRequestException =  null;
    this.lastHTTPRequest = config;
    
    if (this.logger) {
      this.logger(`${LOG_PREFIX}: ${config.method} ${config.url}: Headers = ${JSON.stringify(config.headers)}`);
    }
    
    return this.httpClient.request(config)
      .then((resp) => {
        self.lastHTTPResponse = resp;
        if (resp.data === undefined) {
          return resp;
        } else if (resp.data.data === undefined) {
          return resp.data;
        }
        return resp.data;
      })
      .catch((err) => {
        self.lastHTTPRequestException = err;
        if (err.response.data === undefined) {
          throw err;
        }
        throw err.response.data;
      });
  }
  
  /**
   * @param {Object} headers Additional headers to add
   * 
   * @returns {Object}
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

module.exports = DeskproClient;
