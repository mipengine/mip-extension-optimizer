mip-extension-optimizer
===========


MIP Extension Optimizer

<a href="https://circleci.com/gh/mipengine/mip-extension-optimizer/tree/master"><img src="https://img.shields.io/circleci/project/mipengine/mip-extension-optimizer/master.svg?style=flat-square" alt="Build Status"></a>

## CLI

First, install with `npm i -g`

```
$ npm i -g mip-extension-optimizer
```

And then, use `mip-extension-optimise [extensions dir]` command to optimise MIP extensions.

```
$ mip-extension-optimise mip-extensions
```

## API

This package provides some APIs for MIP extension infomation.


### import

```
$ npm i mip-extension-optimizer --save
```


### load all extensions from directory

```js
var extOptimizer = require('mip-extension-optimizer');

extOptimizer.load('/your/extensions/root/directory').then(
    function (extensions) {
        extensions.forEach(function (extension) {
            // extension.info has some data from package.json and README.md, such as:
            // ================
            // extension.info.name (parse from package.json)
            // extension.info.version (parse from package.json)
            // extension.info.doc (parse from README.md)
            // extension.info.usage (parse from README.md)
        });
    }
);
```

### load single extension

```js
var extOptimizer = require('mip-extension-optimizer');
var extension = new extOptimizer.Extension('/your/extension/directory');

// extension.info has some data from package.json and README.md, such as:
// ================
// extension.info.name (parse from package.json)
// extension.info.version (parse from package.json)
// extension.info.doc (parse from README.md)
// extension.info.usage (parse from README.md)
```

### use build result in program

```js
var extOptimizer = require('mip-extension-optimizer');
var extension = new extOptimizer.Extension('/your/extension/directory');
var builder = extension.createBuilder();

builder.process().then(function () {
    // get all files of extension, and traverse
    var files = getFiles();
    files.forEach(function (file) {
        // ...
    });

    // get file by path (relative)
    var file = builder.getFile('extension-name/main.js');

    // get file content
    file.getData();
});
```
