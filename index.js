'use strict';

var Hoek = require('hoek');
var path = require('path');

/**
 * Constructor, returns a Querious instance matching the specified dialect.
 *
 * @param options Object containing, at least, the keys dialect and sql_folder.
 * @returns {Dialect} Querious dialect instance.
 */
module.exports = function (options) {
  Hoek.assert(options, 'Querious: Options object must be provided.');
  Hoek.assert(options.dialect, 'Querious: dialect must be set.');
  Hoek.assert(options.sql_folder, 'Querious: sql_folder must be set.');

  var Dialect = require(path.join(__dirname, 'dialects', options.dialect));

  return new Dialect(options);
};
