var nconf = require('nconf');
nconf.argv()
  .env()
  .file({
    file: 'config.json'
  });

var _ = require('lodash');
var server =  require('./lib/server');
var address = 'tcp://0.0.0.0:' + nconf.get('rpc').port;
console.log('Starting RPC server listening at:', address);
server.bind(address);


