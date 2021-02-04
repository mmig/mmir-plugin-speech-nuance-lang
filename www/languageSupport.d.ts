import { Gender, VoiceResult, LabeledVoiceDetails } from './langSupportUtils';
export { LanguageSupport, Gender, VoiceResult, LabeledVoiceDetails } from './langSupportUtils';
export declare function ttsLanguages(): string[];
export declare function ttsVoices(langCode?: string, gender?: Gender): LabeledVoiceDetails[];
export declare function ttsVoiceNames(langCode?: string, gender?: Gender): string[];
export declare function ttsBestVoiceFor(langCode: string, gender?: Gender): VoiceResult;
export declare function asrLanguages(): string[];
export declare function ttsSelectVoice(langCode: string, query?: Gender | string): LabeledVoiceDetails;
/** set "local availability" for all voices; DEFAULT false (i.e. network/internet access required for all voices) */
export declare function ttsVoicesLocal(allVoicesLocal: boolean | undefined): void;
