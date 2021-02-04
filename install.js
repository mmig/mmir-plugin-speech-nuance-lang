
var path = require('path');
var installFiles = require('./res/install-utils');

var srcDirRoot = __dirname;

function copyFiles(srcDirType, targetDir, callback){

  var srcDir = path.isAbsolute(srcDirType)? srcDirType : path.join(srcDirRoot, srcDirType);
  installFiles(srcDir, targetDir, callback);
}

module.exports = copyFiles;