
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

import { asrLanguages as asrLanguageList , ttsLanguages as ttsLanguageList } from './languages';
import { LanguageSupport, Gender, VoiceResult } from './langSupportUtils';
import { VoiceDetails } from 'mmir-lib';

const genderType = {
  'F': 'female',	//map: list-entry -> type
  'M': 'male',	//map: list-entry -> type
};

const nuanceLangSupport = new LanguageSupport(
  asrLanguageList,
  ttsLanguageList,
  function parseGender(gender: string): Gender {
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
  },
  function selectVoiceFilter(voiceName: string): string {
    return voiceName.replace(/-ML$/, '');
  }
);

export function ttsLanguages(): string[] { return nuanceLangSupport.getTTS('code') as string[];};
export function ttsVoices(langCode?: string, gender?: Gender): VoiceDetails[] { return nuanceLangSupport.getTTS('voice', langCode, gender) as VoiceDetails[];};
export function ttsVoiceNames(langCode?: string, gender?: Gender): string[] { return nuanceLangSupport.getTTS('voiceName', langCode, gender) as string[];};
export function ttsBestVoiceFor(langCode: string, gender?: Gender): VoiceResult { return nuanceLangSupport.getBestVoice(langCode, gender);};
export function asrLanguages(): string [] { return nuanceLangSupport.getASR('code');};
export function ttsSelectVoice(langCode: string, query?: Gender | string): VoiceDetails { return nuanceLangSupport.ttsSelectVoiceFor(langCode, query); };