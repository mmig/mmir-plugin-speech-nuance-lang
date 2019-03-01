
var lang = require('./www/languageTools.js');

var queries = [
  'EnG', 'enG_gBr', 'eng-Ind', 'deu-SWE', 'fra', 'fra_fra'
];

function testBest(l, f){
  var res = lang.ttsBestVoiceFor(l, f);
  console.log(JSON.stringify(l) + ' + ' + JSON.stringify(f) + ' -> ', res);

  var parts = l.split(/[-_]/);
  var resParts = res.voice.language.split('-');
  if(parts[0]){
    if(parts[0].toLowerCase() !== resParts[0]){
      throw Error('language code did not match: requested '+JSON.stringify(parts[0])+', but got: ' + JSON.stringify(resParts[0]));
    }
  }
}

queries.forEach(function(q){
  testBest(q);
  testBest(q, 'male');
  testBest(q, 'female');
  testBest(q, '');
  testBest(q, null);
  testBest(q.toUpperCase());
  testBest(q.toLowerCase());
});


var voices = [
  'ava', 'petra', 'anna-ml', 'male', 'female', 'fra'
];

function testSelect(code, filter){
  var v = lang.ttsSelectVoice(code, filter);
  console.log('selected voice '+JSON.stringify(code)+'  + '+JSON.stringify(filter)+' -> ', v);

  if(!v){
    throw new Error('did not find voice for '+JSON.stringify(filter)+ ' (code: '+JSON.stringify(filter)+')');
  }
}

voices.forEach(function(q){
  testSelect(null, q);
  testSelect(void(0), q);
  testSelect('', q);
  testSelect('deu', q);
  testSelect('eng-AUS', q);
});
