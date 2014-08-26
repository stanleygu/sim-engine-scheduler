'use strict';
var zerorpc = require('zerorpc');
var nconf = require('nconf');

var jobs = kue.createQueue({
  redis: {
    host: nconf.get('redis').host,
    port: nconf.get('redis').port
  }
});

var api = {
  addSimJob: function(job, callback) {
    var newJob = jobs
      .create(job)
      .save(function(err) {
        if (err) {
          console.log('Error with job', JSON.stringify(job));
        }
      });
    // Events
    newJob.on('complete', function(result) {
      callback(null, result);
    }).on('failed', function() {
      callback('Job failed');
    });
  }
}

module.exports = new zerorpc.Server(api);
