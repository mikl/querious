// Test that basic instantiation of the Querious “class” works.
'use strict';

var Code = require('code');
var Lab = require('lab');
var Querious = require('../index');

var lab = module.exports.lab = Lab.script();


lab.experiment('basic querious instance config', function () {
  lab.test('it fails when not providing options', function (done) {
    var throws = function () {
      var instance = new Querious();

      // This like is needed to make ESlint happy.
      instance.test = 'yes';
    };

    Code.expect(throws).to.throw(Error, 'Querious: Options object must be provided.');

    done();
  });

  lab.test('it fails when dialect is not set', function (done) {
    var throws = function () {
      var instance = new Querious({
        sql_folder: 'test/fixtures'
      });

      // This like is needed to make ESlint happy.
      instance.test = 'yes';
    };

    Code.expect(throws).to.throw(Error, 'Querious: dialect must be set.');

    done();
  });

  lab.test('it fails when sql_folder is not set', function (done) {
    var throws = function () {
      var instance = new Querious({
        dialect: 'postgresql'
      });

      // This like is needed to make ESlint happy.
      instance.test = 'yes';
    };

    Code.expect(throws).to.throw(Error, 'Querious: sql_folder must be set.');

    done();
  });

  lab.test('it works with minimal settings', function (done) {
    var instance = new Querious({
      dialect: 'postgresql',
      sql_folder: 'test/fixtures'
    });

    Code.expect(instance).to.be.an.object();
    Code.expect(instance.query).to.be.a.function();

    done();
  });
});
