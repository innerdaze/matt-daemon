matt-daemon
===========

A lightweight HTTP daemon for serving a static site.

With Matt Daemon, there are no surprises. He just serves.


Installation
------------

```npm install --save matt-daemon```

Usage
-----

```js
require('matt-daemon')({
  port: HTTP_LISTENING_PORT,
  root: CONTENT_ROOT_DIRECTORY
});
```