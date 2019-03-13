import { VoiceDetails } from 'mmir-lib';
export declare type Gender = "female" | "male";
export declare type VoiceResult = {
    voice: VoiceDetails;
    language: string;
    filter: string;
};
/**
 * get "best" matching voice for a language:
 * will try to select a voice with the specified gender (if specified) and country-code (if specified).
 *
 * If no matching voice (for specified gender and/or country-code) can be found, a voice that matches
 * the language-code will be returned.
 *
 * I.e. the function will always return a voice, as long as the language does have any voice; if the
 * language is not supported, NULL is returned.
 *
 *
 * NOTE: if gender and country-code are specified, the gender-specification is prioritized, i.e. the returned
 *       voice may have a different country-code.
 *
 *  @param langCode {String}
 *  			an ISO3 language code (lower case), optionally with ISO3 country code (upper case)
 *  @param [filter] {Gender} OPTIONAL
 *  			the (preferred) gender for the voice
 *
 *  @returns {VoiceResult} the best matching voice as {voice: {name: STRING, language: STRING, gender: Gender}, language: <language param>, filter: <filter param>}
 *           or NULL, if not voice could be found for that language
 */
declare function getBestVoice(langCode: string, gender?: Gender): VoiceResult;
/**
 * select a voice by its name or by filter (gender) and language-code
 *
 * @param  {string} langCode the language-code (may include a country-code); NOTE if a voice-name matches, the langCode is ignored!
 * @param  {string} query the voice name or filter-query; if FALSY the first matching voice for langCode will be used
 * @return {Voice} the voice matching the query (may be a "best match", i.e. not exactly match the query)
 */
declare function ttsSelectVoiceFor(langCode: string, query?: Gender | string): VoiceDetails;
export declare function ttsLanguages(): (string | VoiceDetails)[];
export declare function ttsVoices(langCode?: string, gender?: Gender): VoiceDetails[];
export declare function ttsVoiceNames(langCode?: string, gender?: Gender): string[];
export declare const ttsBestVoiceFor: typeof getBestVoice;
export declare function asrLanguages(): string[];
export declare const ttsSelectVoice: typeof ttsSelectVoiceFor;
export {};
