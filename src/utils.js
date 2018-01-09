module.exports = {
  /**
   * @param {Object} form
   * @returns {Promise}
   */
  getFormHeaders: (form) => {
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
};
