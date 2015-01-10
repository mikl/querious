// Test that loading SQL files for PostgreSQL works.
'use strict';

var Code = require('code');
var Lab = require('lab');
var Querious = require('../index');
var path = require('path');

var lab = module.exports.lab = Lab.script();


lab.experiment('PostgreSQL sql file loading', function () {
  lab.test('it works with a basic query', function (done) {
    var instance = new Querious({
      cache_sql: false,
      dialect: 'postgresql',
      sql_folder: path.resolve(__dirname, 'sql/postgresql')
    });

    instance.loadSql('basic-query', function (err, sql) {
      Code.expect(err).to.not.exist();
      Code.expect(sql).to.equal("SELECT 2+2;\n");

      done();
    });
  });
});
