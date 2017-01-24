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
 * @license       CC
 *
 */
/**
 * @param {Object}  opts
 * @param {Number}  opts.port       Port to listen for incoming HTTP requests
 * @param {String}  opts.root       Folder to use as site root directory
 * @param {Boolean} opts.justMatt   True to not daemonize. Useful for debugging as the HTTP server's stdout will be piped to the console
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

    var spawn = require('child_process').spawn;
    var fs = require('fs');
    var path = require('path');
    var pkill = require('tree-kill');
    var print = require('dye').zalgo;
    var daemon = require('daemon');
    var defaults = require('defaults');


    var defaultOpts = {

        port    : 9000,
        root    : './public',
        pidFile : 'matt-daemon.pid',
        justMatt: false

    };

    var config = defaults(opts, defaultOpts);

    var PORT = config.port;
    var SITE_DIRECTORY = config.root;
    var PID_FILE_PATH = config.pidFile;
    var JUST_MATT = config.justMatt;


    // Set up log streams

    var Log = require('log');

    var debugLog = new Log('debug', fs.createWriteStream('matt-daemon.debug.log'));
    var errorLog = new Log('error', fs.createWriteStream('matt-daemon.error.log'));
    var infoLog = new Log('info', fs.createWriteStream('matt-daemon.log'));

    // First let's check for existing instance and kill it off

    if(fs.existsSync(PID_FILE_PATH)) { // Does a PID file exist

        var pid = fs.readFileSync(PID_FILE_PATH); // Read the PID

        if (pid.length && pid !== process.pid) { // Check it's not the PID of the current process

            util.puts(print('Killing process with id: ' + pid));

            pkill(pid, 'SIGTERM'); // Kill the process tree

            fs.writeFile(PID_FILE_PATH, ''); // Empty the PID file
        }
    }

    util.puts(print('Starting Matt Daemon Server | PORT: ' + PORT + ' | ROOT: ' + SITE_DIRECTORY));

    var httpServer;

    // Spawn HTTP server - if justMatt is false, daemonize

    if(!JUST_MATT) {

        httpServer = daemon.daemon('./node_modules/.bin/http-server', [SITE_DIRECTORY, '-p', PORT], {
            cwd: __dirname,
            stdout: infoLog.info.stream,
            stderr: errorLog.error.stream
        });

    } else {

        httpServer = spawn('./node_modules/.bin/http-server', [SITE_DIRECTORY, '-p', PORT], {
            cwd: __dirname,
            stdio: 'pipe'
        });

        // Configured logging on stdout and stderr

        httpServer.stderr.setEncoding('utf8');
        httpServer.stdout.setEncoding('utf8');

        httpServer.stderr.on('data', errorLog.error.bind(errorLog));
        httpServer.stdout.on('data', function(data){
            // infoLog.info(process.pid);
            infoLog.info(data);
        });

    }

    httpServer.on('close', function (code) {
        if (code !== 0) {
            log.info('process exited with code ' + code);
        }
    });


    // Write PID to file

    fs.writeFile(PID_FILE_PATH, httpServer.pid.toString());

    infoLog.info('Starting Matt Daemon Server | Daemon PID: ' + process.pid + ' | HTTP PID: ' + httpServer.pid + ' | PORT: ' + PORT + ' | ROOT: ' + SITE_DIRECTORY);

};