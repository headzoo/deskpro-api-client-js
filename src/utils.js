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

/**
 * @param {Object} form
 * @returns {Promise}
 */
function getFormHeaders(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if(err) {
        return reject(err);
      }
      resolve(Object.assign({
        'Content-Length': length
      }, form.getHeaders()));
    });
  });
}

/**
 * Turns an object into a HTTP query string
 * 
 * @param {Object} params
 * @returns {string}
 */
function buildQueryString(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

/**
 * Modifies the url by adding a query string and interpolating {placeholders}
 * 
 * @param {String} url
 * @param {Object} params
 * @returns {String}
 */
function interpolateURL(url, params) {
  for(let key in params) {
    if (params.hasOwnProperty(key)) {
      const r = new RegExp('{' + key + '}');
      const found = url.match(r);
      if (found) {
        url = url.replace(found[0], params[key]);
        delete params[key];
      }
    }
  }
  
  const query = buildQueryString(params);
  if (query) {
    url = `${url}?${query}`;
  }
  
  return url;
}

module.exports = {
  getFormHeaders,
  buildQueryString,
  interpolateURL
};
