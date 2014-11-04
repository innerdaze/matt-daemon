matt-daemon
===========

A lightweight HTTP daemon for serving a static site.

With Matt Daemon, there are no surprises. He just serves.


Installation
------------

1. Install the http-server binary from NPM onto your target platform with `npm install -g  http-server`

2. Install the daemon package into your project's directory with `npm install daemon`

3. Add matt-daemon.js to your project's directory

4. Change the SITE_DIRECTORY & PORT variables to meet your requirements

Usage
-----

A common usage of this Matt is to call him when you start the app. To do this efficiently, place the following in your package.json file

```js
...
"scripts": {
  "start": "node ./matt-daemon.js"
}
...
```

You can now make Matt move by running `npm start` from your project's root directory
