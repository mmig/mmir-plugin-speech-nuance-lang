"use strict";
// var languages = require('./languages');
//
// /**
//  * TTS languages & voices:
//  * list of arrays, where an array in the list contains
//  * <pre>
//  * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
//  * </pre>
//  * @type Array<Array<string>>
//  */
// var ttsLanguages = languages.ttsLanguages;
//
// /**
//  * ASR languages:
//  * list of arrays, where an array in the list contains
//  * <pre>
//  * [0] Language, [1]	6 char *, [2]	Frequency
//  * </pre>
//  * @type Array<Array<string>>
//  */
// var asrLanguages = languages.asrLanguages;
Object.defineProperty(exports, "__esModule", { value: true });
var languages_1 = require("./languages");
var langSupportUtils_1 = require("./langSupportUtils");
var genderType = {
    'F': 'female',
    'M': 'male',
};
var nuanceLangSupport = new langSupportUtils_1.LanguageSupport(languages_1.asrLanguages, languages_1.ttsLanguages, function parseGender(gender) {
    return genderType[gender];
}, {
    //[0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
    ttsLabel: 0,
    ttsCode: 1,
    ttsName: 2,
    ttsGender: 3,
    //	[0] Language, [1]	6 char *, [2]	Frequency
    asrLabel: 0,
    asrCode: 1
}, function selectVoiceFilter(voiceName) {
    return voiceName.replace(/-ML$/, '');
});
function ttsLanguages() { return nuanceLangSupport.getTTS('code'); }
exports.ttsLanguages = ttsLanguages;
;
function ttsVoices(langCode, gender) { return nuanceLangSupport.getTTS('voice', langCode, gender); }
exports.ttsVoices = ttsVoices;
;
function ttsVoiceNames(langCode, gender) { return nuanceLangSupport.getTTS('voiceName', langCode, gender); }
exports.ttsVoiceNames = ttsVoiceNames;
;
function ttsBestVoiceFor(langCode, gender) { return nuanceLangSupport.getBestVoice(langCode, gender); }
exports.ttsBestVoiceFor = ttsBestVoiceFor;
;
function asrLanguages() { return nuanceLangSupport.getASR('code'); }
exports.asrLanguages = asrLanguages;
;
function ttsSelectVoice(langCode, query) { return nuanceLangSupport.ttsSelectVoiceFor(langCode, query); }
exports.ttsSelectVoice = ttsSelectVoice;
;
//# sourceMappingURL=languageSupport.js.map