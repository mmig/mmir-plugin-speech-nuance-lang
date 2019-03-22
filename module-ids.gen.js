
/*********************************************************************
 * This file is automatically generated by mmir-plugins-export tools *
 *         Do not modify: ANY CHANGES WILL GET DISCARED              *
 *********************************************************************/

var _id = "mmir-plugin-speech-nuance-lang";
var _paths = {
  "mmir-plugin-speech-nuance-lang/langSupportUtils.d.ts": "www/langSupportUtils.d.ts",
  "mmir-plugin-speech-nuance-lang/langSupportUtils": "www/langSupportUtils.js",
  "mmir-plugin-speech-nuance-lang/langSupportUtils.js.map": "www/langSupportUtils.js.map",
  "mmir-plugin-speech-nuance-lang/languages.d.ts": "www/languages.d.ts",
  "mmir-plugin-speech-nuance-lang/languages": "www/languages.js",
  "mmir-plugin-speech-nuance-lang/languages.js.map": "www/languages.js.map",
  "mmir-plugin-speech-nuance-lang/languageSupport.d.ts": "www/languageSupport.d.ts",
  "mmir-plugin-speech-nuance-lang/languageSupport": "www/languageSupport.js",
  "mmir-plugin-speech-nuance-lang/languageSupport.js.map": "www/languageSupport.js.map",
  "mmir-plugin-speech-nuance-lang": "index.js"
};
var _workers = [];
var _exportedModules = [
  "mmir-plugin-speech-nuance-lang"
];
var _dependencies = [];
var _exportedFiles = [];
var _modes = {};
function _join(source, target, dict){
  source.forEach(function(item){
    if(!dict[item]){
      dict[item] = true;
      target.push(item);
    }
  });
};
function _getAll(type, mode, isResolve){

  if(typeof mode === 'boolean'){
    isResolve = mode;
    mode = void(0);
  }

  var data = this[type];
  var isArray = Array.isArray(data);
  var result = isArray? [] : Object.assign({}, data);
  var dupl = result;
  var mod = mode && this.modes[mode];
  if(isArray){
    dupl = {};
    if(mod && mod[type]){
      _join(this.modes[mode][type], result, dupl);
    }
    _join(data, result, dupl);
  } else if(isResolve){
    var root = __dirname;
    Object.keys(result).forEach(function(field){
      var val = result[field];
      if(mod && mod[field]){
        val = _paths[mod[field]];
      }
      result[field] = root + '/' + val;
    });
  }
  this.dependencies.forEach(function(dep){
    var depExports = require(dep + '/module-ids.gen.js');
    var depData = depExports.getAll(type, mode, isResolve);
    if(isArray){
      _join(depData, result, dupl);
    } else {
      Object.assign(result, depData)
    }
  });

  return result;
};
module.exports = {id: _id, paths: _paths, workers: _workers, modules: _exportedModules, files: _exportedFiles, dependencies: _dependencies, modes: _modes, getAll: _getAll};
