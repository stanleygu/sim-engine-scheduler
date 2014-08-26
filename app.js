var nconf = require('nconf');
nconf.argv()
  .env()
  .file({
    file: 'config.json'
  });

var _ = require('lodash');
var kue = require('kue');
var server =  require('./lib/server');
server.bind('tcp://127.0.0.1:' + nconf.get('rpc').port);


