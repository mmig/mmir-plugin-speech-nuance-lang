
var path = require('path');
var fs = require('fs');
var langUtils = require('mmir-plugin-lang-support');

langUtils.installFiles('src', path.resolve(__dirname, '../src'), function(err){
  if(err){
    console.log('failed to install resources from mmir-plugin-lang-support: ', err);
    process.exit(1);
  }
  console.log('installed resources from mmir-plugin-lang-support');
});

// copy mmir-plugin-lang-support/install.js -> res/install-utils.js
var installScript = path.join( path.dirname(require.resolve('mmir-plugin-lang-support')), 'install.js');
var installScriptName = 'install-utils.js';
fs.copyFile(installScript, path.resolve(__dirname, installScriptName), function(err){
  if(err){
    console.log('mmir-plugin-lang-support.install(): ERROR copying '+installScript+': ', err);
    process.exit(1);
  }
  console.log('installed res/'+installScriptName+' from mmir-plugin-lang-support');
});