
var path = require('path');
var langUtils = require('mmir-plugin-lang-support');

langUtils.installFiles('src', path.resolve(__dirname, '../src'), function(err){
  if(err){
    console.log('failed to install resources from mmir-plugin-lang-support: ', err);
    process.exit(1);
  }
  console.log('installed resources from mmir-plugin-lang-support');
});
