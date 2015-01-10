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

  lab.test('it works with a basic query in a .pgsql file', function (done) {
    var instance = new Querious({
      dialect: 'postgresql',
      sql_folder: path.resolve(__dirname, 'sql/postgresql')
    });

    instance.loadSql('pi-approximation', function (err, sql) {
      Code.expect(err).to.not.exist();
      Code.expect(sql).to.equal("SELECT 22/7;\n");

      done();
    });
  });

  lab.test('it works when loading an empty file', function (done) {
    var instance = new Querious({
      cache_sql: true,
      dialect: 'postgresql',
      sql_folder: path.resolve(__dirname, 'sql/postgresql')
    });

    instance.loadSql('empty', function (err, sql) {
      Code.expect(err).to.not.exist();
      Code.expect(sql).to.equal("");

      done();
    });
  });

  lab.test('it fails when loading a non-existing file', function (done) {
    var instance = new Querious({
      dialect: 'postgresql',
      sql_folder: path.resolve(__dirname, 'sql/postgresql')
    });

    instance.loadSql('does-not-exist', function (err, sql) {
      Code.expect(err.slice(0, 42)).to.equal("Querious: No file matching `does-not-exist");
      Code.expect(sql).to.not.exist();

      done();
    });
  });

  lab.test('it fails when encountering ambiguous file names', function (done) {
    var instance = new Querious({
      cache_sql: true,
      dialect: 'postgresql',
      sql_folder: path.resolve(__dirname, 'sql/postgresql')
    });

    instance.loadSql('ambiguous', function (err, sql) {
      Code.expect(err.slice(0, 55)).to.equal("Querious: Ambigious, multiple files matching `ambiguous");
      Code.expect(sql).to.not.exist();

      done();
    });
  });
});
