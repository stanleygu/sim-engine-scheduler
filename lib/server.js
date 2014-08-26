'use strict';
var zerorpc = require('zerorpc');
var nconf = require('nconf');
var kue = require('kue');

var jobs = kue.createQueue({
  redis: {
    host: nconf.get('redis').host,
    port: nconf.get('redis').port
  }
});

var api = {
  echo: function(data, reply) {
    console.log('Echoing: ', data);
    reply(null, data, false);
  },
  addSimJob: function(job, callback) {
    console.log('Received job', JSON.stringify(job))
    var newJob = jobs
      .create('sim', job)
      .save(function(err) {
        if (err) {
          console.log('Error with job', JSON.stringify(job));
        }
      });
    // Events
    newJob.on('complete', function(result) {
      console.log('Job Completed');
      jobs.client.get('sim:' + job.sbml.name, function(err, reply) {
        if (reply) {
          callback(null, reply);
        } else {
          callback(null);
        }
      });
    }).on('failed', function() {
      callback('Job failed');
    });
  }
}

module.exports = new zerorpc.Server(api);
