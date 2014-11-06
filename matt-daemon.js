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
module.exports = function(opts){

    var util = require('util');

    if(!opts){
        util.puts('Matt Daemon can\'t guess your config, so help a chap out.');
        return;
    }

    if(!opts.port){
        util.puts('Matt Daemon would love to serve, but he needs to know what port you want to publish on.');
        return;
    }

    if(!opts.root){
        util.puts('Matt Daemon has almost figured it out, but he needs to know which folder to serve up.');
        return;
    }

    var PORT = opts.port;
    var SITE_DIRECTORY = opts.root;

    var exec = require('child_process').exec;
    var fs = require('fs');
    var path = require('path');
    var Log = require('log');
    //var debugLog = new Log('debug', fs.createWriteStream('matt-daemon.debug.log'));
    var errorLog = new Log('error', fs.createWriteStream('matt-daemon.error.log'));
    var infoLog = new Log('info', fs.createWriteStream('matt-daemon.log'));
    //var pidStream = fs.createWriteStream('matt-daemon.pid');


    var pidFilePath = 'matt-daemon.pid';

    // First let's check for existing instance and kill it off
    if(fs.existsSync(pidFilePath)) {
        var pid = fs.readFileSync(pidFilePath);
        if (pid.length && pid !== process.pid) {
            util.puts('Killing process with id: ' + pid);
            process.kill(pid, 'SIGHUP');
            fs.writeFile(pidFilePath, '');
        }
    }

    // exec callback
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

    util.puts('Starting Matt Daemon Server');

    var childProcess = exec("./node_modules/.bin/http-server " + SITE_DIRECTORY + " -p " + PORT, {
        cwd: __dirname
    }, puts);

    childProcess.on('error', function(err){
        errorLog.error(err);
    });

    fs.writeFile(pidFilePath, childProcess.pid.toString());

    infoLog.info('Starting Matt Daemon Server with pid: ' + childProcess.pid);

    require('daemon')();

};