# tk-cyc

*tk-cyc* provides an intuitive and hassle-free starting point for Cycle.js applications. It comes with production and development webpack configurations, dynamic hot reloading, Babel transpilation, unintrusive long-term caching, and an isomorphic express server. The *tk-cyc* boilerplate is scalable, convenient, and highly modular.


## Contents
- [Features](#features)
- [Installing](#installing)
- [Getting Started](#getting-started)
- [npm scripts](#npm-scripts)
- [How It Works](#how-it-works)
  - [Server, Client, and Isomorphism](#server-client-and-isomorphism)
  - [Dynamic Require](#dynamic-require)
  - [Request Pipeline](#request-pipeline)
  - [Isomorphic Reloading](#isomorphic-reloading)
  - [Routing](#routing)
  - [Long-Term Caching](#long-term-caching)

## Features
- production and development webpack configurations
- project-wide babel transpilation
- hot reloading with cycle-restart
- dynamic isomorphic loading with dynamic-require
- declarative server endpoints
- long-term caching

## Installing

```sh
$ npm install -g tk-cyc-cli babel-cli
```

## Getting Started

Run `tkcyc` in any directory, and you will be prompted for the name of your project, and what directory to put it in. The directory name defaults to the project name.

```sh
$ tkcyc
  Application Name myapp
  Directory (myapp)
  Copying...
  Populating...
  Done.
$ cd myapp
$ npm i
```

Then, you can run the server in development.

```sh
$ npm run dev
```

The website is now live on [localhost:3000](http://localhost:3000/).

Have a look in `./src/js/` and play around with the files. An index page with a BMI calculator and a simple about page are automatically generated. Each file is hot reloadable.

You can also build the server and run it in production. Compiling the client bundles may take a while, because this build step utilizes heavy optimization.

```sh
$ npm run mk
$ PORT=80 npm start
```

Note: When actually hosting a live website, you should change `::1` to `0.0.0.0` or `::`.

## npm scripts

- `dev` start dev server
- `start` start production server (requires built server and client)
- `mkserver` build production server (fast)
- `mkclient` build production client (slow)
- `mk` build production server and client

## How It Works

*cyc* has some special plumbing that allows much of its code to be flexible and freely run in dev or production, client or server. This feature required close attention to details during the design process.

### Server, Client, and Isomorphism

In development, the server is run entirely with `babel-node`, provided by `babel-cli`. In production, the server (output by the `mkserver` build step) is run with the default `node` installation. Application modules, or **programs**, are parsed with an isolated `babel-register`ed require. Entry-level modules can check the global `CLIENT` variable to determine whether to use server or client logic. This is set to false on the server with `global.CLIENT = false`, while the webpack configuration sets it to `true` with a `DefinePlugin`.

### Dynamic Require

Allowing the server to be built for production is one of the main design goals, but due to webpack's poor support for dynamic requires (i.e. `require(variable)`), some special tooling is required. The `dynamic-require` package provides dynamic requires, and supports babel transpilation.

### Request Pipeline

For each request, the program is run, and its virtual DOM output is rendered and wrapped in an HTML template. A reference to the actual bundle is then placed at the end of the file. When the response reaches the client, the rendered content is immediately available while the program is loading. Once loaded, the program will bootstrap itself, and the application will be responsive.

### Isomorphic Reloading

The server can hot reload modules for server-side rendering, just as the client can with webpack-hmr. Implemented in `hot.js`, the reloading mechanism hooks into the webpack compiler object in the same way that `webpack-hot-middleware` does. When a program dependency is modified, invalidation is trickled down the tree all the way to the entry-level module. Invalidated modules are deleted from the require cache, and re-required with `dynamic-require`, making the updated version of the program available.

### Routing

Routes are configured in the `routes.js` file. Each configurable route contains a reference to the index file of its respective program, pug (formerly jade) template, and route path. These routes are then transformed to normalize paths and add compilation metadata for webpack. Each route is then linked to the server request handler. The routing configuration can be customized to make other specific logic available in the request handler.

### Long-Term Caching

The server contains a `hashes` object that maps route IDs to their respective bundles. In development, this is reloaded in memory whenever a new compilation is performed. In production, the hashes are read from the `hashes.json` file produced by the `mkclient` build step.
