import { Gender, VoiceResult } from './langSupportUtils';
import { VoiceDetails } from 'mmir-lib';
export declare function ttsLanguages(): (string | VoiceDetails)[];
export declare function ttsVoices(langCode?: string, gender?: Gender): VoiceDetails[];
export declare function ttsVoiceNames(langCode?: string, gender?: Gender): string[];
export declare function ttsBestVoiceFor(langCode: string, gender?: Gender): VoiceResult;
export declare function asrLanguages(): string[];
export declare function ttsSelectVoice(langCode: string, query?: Gender | string): VoiceDetails;
