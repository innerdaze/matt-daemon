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

    var PORT = opts.port;
    var SITE_DIRECTORY = opts.root;

    var exec = require('child_process').exec;
    var fs = require('fs');
    var path = require('path');
    var pkill = require('tree-kill');
    var Log = require('log');
    //var debugLog = new Log('debug', fs.createWriteStream('matt-daemon.debug.log'));
    var errorLog = new Log('error', fs.createWriteStream('matt-daemon.error.log'));
    var infoLog = new Log('info', fs.createWriteStream('matt-daemon.log'));

    var pidFilePath = 'matt-daemon.pid';

    // First let's check for existing instance and kill it off
    if(fs.existsSync(pidFilePath)) {
        var pid = fs.readFileSync(pidFilePath);
        if (pid.length && pid !== process.pid) {
            util.puts('Killing process with id: ' + pid);
            pkill(pid, 'SIGHUP');
            fs.writeFile(pidFilePath, '');
        }
    }

    // Function to call when HTTP Server exits
    function puts(error, stdout, stderr) {

        infoLog.info(stdout);

        errorLog.error(stderr);

        if (error !== null) {
            errorLog.error(error);
        }

    }

    // Spawn HTTP server
    var childProcess = exec('"./node_modules/.bin/http-server" "' + SITE_DIRECTORY + '" -p ' + PORT, {
        cwd: __dirname,
        maxBuffer: 1024 * 500
    }, puts);

    // Stream outputs to log files
    childProcess.on('error', errorLog.error.bind(errorLog));

    childProcess.stderr.on('data', errorLog.error.bind(errorLog));

    // Write PID to file
    fs.writeFile(pidFilePath, childProcess.pid.toString());

    util.puts('Starting Matt Daemon Server | PID: ' + childProcess.pid + ' | PORT: ' + PORT + ' | ROOT: ' + SITE_DIRECTORY);
    infoLog.info('Starting Matt Daemon Server | PID: ' + childProcess.pid + ' | PORT: ' + PORT + ' | ROOT: ' + SITE_DIRECTORY);

    require('daemon')();

};

/**
 * Child_Process Events
 * error
 * exit
 * close
 * disconnect
 * message
 **/
