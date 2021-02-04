
import { asrLanguages as asrLanguageList , ttsLanguages as ttsLanguageList } from './languages';
import { LanguageSupport, Gender, VoiceResult, LabeledVoiceDetails } from './langSupportUtils';

export { LanguageSupport, Gender, VoiceResult, LabeledVoiceDetails } from './langSupportUtils';

const genderType = {
  'F': 'female',	 //map: list-entry -> type
  'M': 'male',	   //map: list-entry -> type
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
    // remove "-ML" suffix from voice name, if present, before matching with queried search string:
    return voiceName.replace(/-ML$/, '');
  }
);
nuanceLangSupport.isLocal = false;

export function ttsLanguages(): string[] { return nuanceLangSupport.getTTS('code') as string[];};
export function ttsVoices(langCode?: string, gender?: Gender): LabeledVoiceDetails[] { return nuanceLangSupport.getTTS('voice', langCode, gender) as LabeledVoiceDetails[];};
export function ttsVoiceNames(langCode?: string, gender?: Gender): string[] { return nuanceLangSupport.getTTS('voiceName', langCode, gender) as string[];};
export function ttsBestVoiceFor(langCode: string, gender?: Gender): VoiceResult { return nuanceLangSupport.getBestVoice(langCode, gender);};
export function asrLanguages(): string [] { return nuanceLangSupport.getASR('code');};
export function ttsSelectVoice(langCode: string, query?: Gender | string): LabeledVoiceDetails { return nuanceLangSupport.ttsSelectVoiceFor(langCode, query); };
/** set "local availability" for all voices; DEFAULT false (i.e. network/internet access required for all voices) */
export function ttsVoicesLocal(allVoicesLocal: boolean | undefined): void { nuanceLangSupport.isLocal = allVoicesLocal; };