"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttsVoicesLocal = exports.ttsSelectVoice = exports.asrLanguages = exports.ttsBestVoiceFor = exports.ttsVoiceNames = exports.ttsVoices = exports.ttsLanguages = exports.LanguageSupport = void 0;
var languages_1 = require("./languages");
var langSupportUtils_1 = require("./langSupportUtils");
var langSupportUtils_2 = require("./langSupportUtils");
Object.defineProperty(exports, "LanguageSupport", { enumerable: true, get: function () { return langSupportUtils_2.LanguageSupport; } });
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
    // remove "-ML" suffix from voice name, if present, before matching with queried search string:
    return voiceName.replace(/-ML$/, '');
});
nuanceLangSupport.isLocal = false;
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
/** set "local availability" for all voices; DEFAULT false (i.e. network/internet access required for all voices) */
function ttsVoicesLocal(allVoicesLocal) { nuanceLangSupport.isLocal = allVoicesLocal; }
exports.ttsVoicesLocal = ttsVoicesLocal;
;
//# sourceMappingURL=languageSupport.js.map