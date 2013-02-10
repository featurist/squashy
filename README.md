# Squashy

Packs HTML by inlining javascripts and stylesheets

For those rare times when you want to save a web page and it's JavaScript and CSS assets as a single file.

## Install

npm install squashy

## Usage

### Command Line

    squashy <url>

### PogoScript
    
    inlined html = require 'squashy'.squash 'http://www.featurist.co.uk' !
    console.log (inlined html)

### JavaScript
    
    require('squashy').squash('http://www.featurist.co.uk', function(err, inlinedHtml) {
        if (err) {
            throw err;
        }
        console.log(inlinedHtml);
    });
    