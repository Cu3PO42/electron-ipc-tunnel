var fs = require("fs");
var path = require("path");
var files = fs.readdirSync(".");
for (var i = 0; i < files.length; ++i) {
    var file = files[i];
    if (file.endsWith(".d.ts")) {
        var content = fs.readFileSync(path.join(__dirname, file), {encoding: "utf-8"});
        content = content.replace(/^(?:\/\/\/ <reference path|import \* as Promise from ).*\r?\n/mg, "");
        fs.writeFileSync(path.join(__dirname, file), content, {encoding: "utf-8"});
    }
}
