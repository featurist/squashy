(function() {
    var self = this;
    var httpism, async, resolve, squashHtml, sort, get, replaceIn, linksIn, scriptsIn, elementsInMatchingAs;
    httpism = require("httpism");
    async = require("async");
    resolve = require("url").resolve;
    exports.squash = function(url, continuation) {
        var self = this;
        var gen1_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        continuation = arguments[arguments.length - 1];
        if (!(continuation instanceof Function)) {
            throw new Error("asynchronous function called synchronously");
        }
        url = gen1_arguments[0];
        httpism.get(url, function(gen2_error, gen3_asyncResult) {
            var html;
            if (gen2_error) {
                continuation(gen2_error);
            } else {
                try {
                    html = gen3_asyncResult.body;
                    squashHtml(html, url, continuation);
                } catch (gen4_exception) {
                    continuation(gen4_exception);
                }
            }
        });
    };
    squashHtml = function(html, url, callback) {
        var replacements, gen5_items, gen6_i, r;
        replacements = sort(linksIn(html).concat(scriptsIn(html)));
        gen5_items = replacements;
        for (gen6_i = 0; gen6_i < gen5_items.length; ++gen6_i) {
            r = gen5_items[gen6_i];
            r.url = resolve(url, r.href);
        }
        return async.map(replacements, get, function(err, requested) {
            return callback(err, replaceIn(requested, html));
        });
    };
    sort = function(replacements) {
        return replacements.sort(function(a, b) {
            return a.index - b.index;
        });
    };
    get = function(replacement, continuation) {
        var gen7_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        continuation = arguments[arguments.length - 1];
        if (!(continuation instanceof Function)) {
            throw new Error("asynchronous function called synchronously");
        }
        replacement = gen7_arguments[0];
        httpism.get(replacement.url, function(gen8_error, gen9_asyncResult) {
            if (gen8_error) {
                continuation(gen8_error);
            } else {
                try {
                    replacement.body = gen9_asyncResult.body;
                    continuation(void 0, replacement);
                } catch (gen10_exception) {
                    continuation(gen10_exception);
                }
            }
        });
    };
    replaceIn = function(replacements, html) {
        var i, parts, gen11_items, gen12_i, rep;
        i = 0;
        parts = "";
        gen11_items = replacements;
        for (gen12_i = 0; gen12_i < gen11_items.length; ++gen12_i) {
            rep = gen11_items[gen12_i];
            parts = parts + "" + html.substring(i, rep.index) + "<" + rep.tag + ">" + rep.body + "</" + rep.tag + ">";
            i = rep.index + rep.length;
        }
        return parts + html.substr(i);
    };
    linksIn = function(html) {
        var linkReg;
        linkReg = /<link\s[^>]*href=["']?([^"']+)["'][^\>]*(\/\>|\>\s*\<\/link\>)/gi;
        return elementsInMatchingAs(html, linkReg, "style");
    };
    scriptsIn = function(html) {
        var scriptReg;
        scriptReg = /<script\s[^>]*src=["']?([^"']+)["'][^\>]*(\/\>|\>\s*\<\/script\>)/gi;
        return elementsInMatchingAs(html, scriptReg, "script");
    };
    elementsInMatchingAs = function(html, reg, tag) {
        var elements, m;
        elements = [];
        while (m = reg.exec(html)) {
            elements.push({
                tag: tag,
                index: m.index,
                length: m[0].length,
                href: m[1]
            });
        }
        return elements;
    };
}).call(this);