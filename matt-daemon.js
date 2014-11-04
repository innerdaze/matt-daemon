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

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); }
exec("http-server " + SITE_DIRECTORY + " -p " + PORT, puts);
require('daemon')();
