const fs = require("fs");
const os = require("os");
const path = require("path");
const Module = require("module");

const sourcePath = path.join(__dirname, "server.js");
let source = fs.readFileSync(sourcePath, "utf8");

source = source.replace(
  /\$\{Object\.keys\(CONTENT\)\.map\(s=>.*?\)\.join\("")\}/,
  '${Object.keys(CONTENT).map(s => "<option>" + s + "</option>").join("")}'
);

const fixedPath = path.join(os.tmpdir(), "nursestudy-server-fixed.js");
fs.writeFileSync(fixedPath, source, "utf8");

const mod = new Module(fixedPath, module);
mod.filename = fixedPath;
mod.paths = Module._nodeModulePaths(path.dirname(fixedPath));
mod._compile(source, fixedPath);