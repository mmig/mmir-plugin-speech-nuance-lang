
// export * from './config';

import { VoiceDetails } from 'mmir-lib';

export const languages: SupportedLanguages;
export const languageSupport: LanguageUtils;

export interface SupportedLanguages {
  /**
	 * ASR languages:
	 * list of arrays, where an array in the list contains
	 * <pre>
	 * [0] Language, [1]	6 char *, [2]	Frequency
	 * </pre>
	 */
	asrLanguages: Array<Array<string>>;
    /**
     * TTS languages & voices:
     * list of arrays, where an array in the list contains
     * <pre>
     * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
     * </pre>
     * @type
     */
	ttsLanguages: Array<Array<string>>;
}

export interface LanguageUtils {
		/**
		 * @returns {Array<string>} list of language codes (ISO3 language and country codes)
		 */
    ttsLanguages: () => Array<string>;//function(){ return getTTS('code');},
		/**
		 *
		 * @param [langCode] {String} OPTIONAL
		 * 				if present, only voices with matching language code will be returned
		 * 				Format: ISO3 language-code (lower-case) and optional ISO3 country-code (upper case), e.g. "eng-USA", "spa_ESP", "deu"
		 * @param [gender] {"female" | "male"} OPTIONAL
		 * 				if present, only voices with matching gender will be returned
		 *
		 * @returns {Array<VoiceDetails>} list of of voice-objects: {name: STRING, language: STRING, gender: "female" | "male"}
		 */
    ttsVoices: (langCode?: string, gender?: string) => Array<VoiceDetails>;//{ return getTTS('voice', langCode, gender);},
		/**
		 *
		 * @param [langCode] {String} OPTIONAL
		 * 				if present, only voices with matching language code will be returned
		 * 				Format: ISO3 language-code (lower-case) and optional ISO3 country-code (upper case), e.g. "eng-USA", "spa_ESP", "deu"
		 * @param [gender] {"female" | "male"} OPTIONAL
		 * 				if present, only voices with matching gender will be returned
		 *
		 * @returns {Array<string>} list of voice names
		 */
    ttsVoiceNames: (langCode?: string, gender?: string) => Array<string>;//{ return getTTS('voiceName', langCode, gender);},
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
		 *  @param [filter] {"female" | "male"} OPTIONAL
		 *  			the (preferred) gender for the voice
		 *
		 *  @returns {VoiceResult} the best matching voice as {voice: {name: STRING, language: STRING, gender: "female" | "male"}, language: <language param>, filter: <filter param>}
		 *           or NULL, if not voice could be found for that language
		 */
    ttsBestVoiceFor: (langCode: string, gender?: string) => VoiceResult;
		/**
		 *
		 * @returns {Array<string>} list of strings of language codes or names
		 */
    asrLanguages: () => Array<string>;//{ return getASR('code');},
		/**
		 * select a voice by its name or by filter (gender) and language-code
		 *
		 * @param  {string} langCode the language-code (may include a country-code); NOTE if a voice-name matches, the langCode is ignored!
		 * @param  {string} query the voice name or filter-query; if FALSY the first matching voice for langCode will be used
		 * @return {VoiceDetails} the voice matching the query (may be a "best match", i.e. not exactly match the query)
		 */
    ttsSelectVoice: (langCode: string, query?: string) => VoiceDetails;
}

export type VoiceResult = {voice: VoiceDetails, language: string, filter: string};
