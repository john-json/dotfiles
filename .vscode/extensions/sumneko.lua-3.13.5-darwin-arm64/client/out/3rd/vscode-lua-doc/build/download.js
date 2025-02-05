"use strict";
const fs = require("fs");
const path = require("path");
const url = require('url');
const http = require('http');
function download_file(download_url, download_path) {
    const options = {
        host: url.parse(download_url).host,
        port: 80,
        path: url.parse(download_url).pathname
    };
    var file = fs.createWriteStream(download_path);
    http.get(options, function (res) {
        res.on('data', function (data) {
            file.write(data);
        }).on('end', function () {
            file.end();
            console.log('OK: ' + download_url);
        });
    });
}
function download_dir(download_url, download_path) {
    fs.mkdirSync(download_path, { recursive: true });
    for (const file of [
        "readme.html",
        "contents.html",
        "manual.html",
        "index.css",
        "lua.css",
        "manual.css",
        "logo.gif",
        "osi-certified-72x60.png",
    ]) {
        download_file(download_url + "/" + file, path.join(download_path, file));
    }
}
const docPath = path.join(process.cwd(), "doc");
for (const config of [
    ["en-us/51", "https://www.lua.org/manual/5.1"],
    ["en-us/52", "https://www.lua.org/manual/5.2"],
    ["en-us/53", "https://www.lua.org/manual/5.3"],
    ["en-us/54", "https://www.lua.org/manual/5.4"],
]) {
    download_dir(config[1], path.join(docPath, config[0]));
}
//# sourceMappingURL=download.js.map