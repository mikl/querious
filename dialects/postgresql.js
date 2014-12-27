'use strict';

var fs = require('fs');
var glob = require('glob');
var path = require('path');
var util = require('util');

var sqlCache = {};

module.exports = function (options) {
  var self = this;

  var config = options || {};

  // SQL cache enabled by default.
  if (typeof(config.cache_sql) === "undefined") {
    config.cache_sql = true;
  }

  // Find files like {name}.sql or {name}.pgsql.
  // See https://www.npmjs.com/package/glob for format.
  self.filePattern = '%s.?(pg)sql';

  /**
   * Execute a named query.
   *
   * @param name Name of the query.
   * @param params Parameters to the query, if any.
   * @param callback Node.js-style callback (function(err, response)).
   */
  self.query = function (name, params, callback) {
    self.loadSql(name, function (err, sql) {
      if (err) { callback(err); }

      if (params) {
        config.client.query({
          text: sql,
          values: params
        }, callback);
      }
      else {
        config.client.query(sql, callback);
      }
    });
  };

  /**
   * Load the SQL query from file.
   *
   * @param name Name of the query.
   * @param callback Node.js-style callback (function(err, sql)).
   */
  self.loadSql = function (name, callback) {
    var cacheKey = config.sql_folder + ':' + name;
    var filePattern = util.format(self.filePattern, name);

    if (config.cache_sql && sqlCache[cacheKey]) {
      return callback(null, sqlCache[cacheKey]);
    }

    // Find a SQL file matching the given name.
    glob(filePattern, {
      cwd: config.sql_folder,
      root: config.sql_folder,
      strict: true,
      nodir: true
    }, function (err, matches) {
      if (err) { return callback(err); }

      if (matches.length < 1) {
        callback('Querious: No file matching `' + filePattern + '` found in folder `' + config.sql_folder + '`.');
      }
      else if (matches.length > 1) {
        return callback('Querious: Ambigious, multiple files matching `' + filePattern + '` found in folder `' + config.sql_folder + '`: ' + matches.join(', '));
      }
      else {
        fs.readFile(path.join(config.sql_folder, matches[0]), 'utf-8', function (err, sql) {
          if (!err && config.cache_sql) {
            sqlCache[cacheKey] = sql;
          }

          return callback(err, sql);
        });
      }
    });
  };

  return self;
};
