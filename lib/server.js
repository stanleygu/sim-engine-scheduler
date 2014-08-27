'use strict';
var zerorpc = require('zerorpc');
var nconf = require('nconf');
var kue = require('kue');

console.log('Kue starting with redis host %s:%s', nconf.get('REDIS_HOST'), nconf.get('REDIS_PORT'));
var jobs = kue.createQueue({
  redis: {
    host: nconf.get('REDIS_HOST'),
    port: nconf.get('REDIS_PORT')
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
