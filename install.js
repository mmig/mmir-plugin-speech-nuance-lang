
var path = require('path');
var langUtils = require('mmir-plugin-lang-support');

var srcDirRoot = __dirname;

function copyFiles(srcDirType, targetDir, callback){

  var srcDir = path.isAbsolute(srcDirType)? srcDirType : path.join(srcDirRoot, srcDirType);
  langUtils.installFiles(srcDir, targetDir, callback);
}

module.exports = copyFiles;