/**
 *
 * @title           Matt Daemon
 *
 * @description     A lightweight HTTP daemon for serving a static site. With Matt Daemon, there are no surprises. He just serves.
 *
 * @author          Lee Driscoll
 *
 * @date            04/11/14
 *
 * @copyright       Fuck copyright
 *
 */
var PORT = 8000;
var SITE_DIRECTORY = 'app';

var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var Log = require('log');
//var debugLog = new Log('debug', fs.createWriteStream('matt-daemon.debug.log'));
var errorLog = new Log('error', fs.createWriteStream('matt-daemon.error.log'));
var infoLog = new Log('info', fs.createWriteStream('matt-daemon.log'));

function puts(error, stdout, stderr) {

    util.puts(stdout);
    infoLog.info(stdout);

    util.puts('stderr: ' + stderr);
    errorLog.error(stderr);

    if (error !== null) {
        util.puts('exec error: ' + error);
        errorLog.error(error);
    }

}

var childProcess = exec("http-server " + SITE_DIRECTORY + " -p " + PORT, puts);

childProcess.on('error', function(err){

    errorLog.error(err);

});

require('daemon')();