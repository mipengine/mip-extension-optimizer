var path = require('path');
var fs = require('fs');

function rmdir( path ) {
    var fs = require( 'fs' );

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        fs.readdirSync( path ).forEach(
            function ( file ) {
                var fullPath = require( 'path' ).join( path, file );
                if ( fs.statSync( fullPath ).isDirectory() ) {
                    rmdir( fullPath );
                }
                else {
                    fs.unlinkSync( fullPath );
                }
            }
        );

        fs.rmdirSync( path );
    }
};

function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    }
    catch (e) {
        if (e.code != 'ENOENT')
          throw e;

        return false;
    }
}

function regexpLiteral(source) {
    return source.replace(/[\^\[\]\$\(\)\{\}\?\*\.\+]/g, function (c) {
        return '\\' + c;
    });
}

function genDefinePattern(id, dependencies, extra) {
    var patternSource = 'define\\([\'"]' + regexpLiteral(id) + '[\'"],\\s*\\[\\s*';
    var depsPatternSource = dependencies
        .map(function (dep) {
            return '[\'"]' + regexpLiteral(dep) + '[\'"]';
        })
        .join(',\\s*');

    patternSource += depsPatternSource;
    patternSource += '\\s*\\],\\s*function\\s*\\(';
    if (extra) {
        patternSource += extra;
    }

    return new RegExp(patternSource);
}

exports.genDefinePattern = genDefinePattern;
exports.fileExists = fileExists;
exports.rmdir = rmdir;
