const merge = require('lodash/merge');
const util = require('util');
const request = util.promisify(require('request'));

module.exports = (userOptions, requestId) => {
  if (!requestId) {
    throw new TypeError('httpClient requires requestId!');
  }
  const options = merge({
    json: true,
  }, userOptions);
  options.headers = merge(options.headers, { 
    'X-Request-Id': requestId,
  });
  return request(options);
};
