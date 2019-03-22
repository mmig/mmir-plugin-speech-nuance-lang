import { VoiceDetails } from 'mmir-lib';
export declare type GenderParseFunc = (gender: string) => 'female' | 'male';
export declare type Gender = "female" | "male";
export declare type VoiceResult = {
    voice: VoiceDetails;
    language: string;
    filter: string;
};
/**
 * normalize language code, optionally including separator & country-code:
 *  * language code to lower case
 *  * use '-' as separator
 *  * country code to upper case
 *
 * @param  {string} code [description]
 * @return {string} normalized language (and country) code
 */
export declare function normalizeCode(code: string): string;
export interface LanguageSupportIndex {
    ttsLabel: number;
    ttsCode: number;
    ttsName: number;
    ttsGender: number;
    asrLabel: number;
    asrCode: number;
}
export declare class LanguageSupport {
    asrLanguages: string[][];
    ttsLanguages: string[][];
    parseGender: GenderParseFunc;
    ttsLabel: number;
    ttsCode: number;
    ttsName: number;
    ttsGender: number;
    asrLabel: number;
    asrCode: number;
    readonly voiceSelectFilter: (voiceName: string) => string;
    constructor(asrLanguages: string[][], ttsLanguages: string[][], parseGender: GenderParseFunc, listIndices: LanguageSupportIndex, voiceSelectFilter?: (voiceName: string) => string);
    ttsProjection: {
        [type: string]: (entry: string[], index?: number, list?: string[][]) => string | VoiceDetails;
    };
    /**
     *
     * @param type {"code" | "label" | "voice" | "voiceName"}
     * 					type of returned list: language code, language name, voice information, voice-name
     * @param [langCode] {String} OPTIONAL
     * 				if present for  "voice" or "voiceName", only voices with matching language code will be returned
     * 				Format: ISO3 language-code (lower-case) and optional ISO3 country-code (upper case), e.g. "eng-USA", "spa_ESP", "deu"
     * @param [gender] {Gender} OPTIONAL
     * 				if present for  "voice" or "voiceName", only voices with matching gender will be returned
     *
     * @returns {VoiceInfo} list of strings, depending on type parameter; in case of "voice" a list of voice-objects:
     * 				{name: STRING, language: STRING, gender: Gender}
     */
    getTTS(type: "code" | "label" | "voice" | "voiceName", langCode?: string, gender?: Gender): (string | VoiceDetails)[];
    asrProjection: {
        [type: string]: (entry: string[], index?: number, list?: string[][]) => string;
    };
    /**
     *
     * @param type "code" | "label"
     * 					type of returned list: language code, language name
     *
     * @returns {Array<string>} list of strings of language codes or names
     */
    getASR(type: "code" | "label"): string[];
    /**
     * create sorting function for selecting a "best" voice:
     *
     *  1. if filter is given: prioritize voices that have the same gender as specified by the filter
     *  2. voices that match the country-code of langCode (if langCode includes a country-code)
     *  3. name of the voice
     *
     *  the first entry in the list will be the best match.
     *
     *  NOTE 1: the sorter assumes that the ISO3 language code is the same for all voices in the list.
     *
     *  NOTE 2: the sorter prioritizes gender (if specified) over country-code, so the selected voice may
     *          have a different accent, if no voice with the specified gender exists for that country-code.
     *
     *  @param langCode {String}
     *  			an ISO3 language code (lower case), optionally with ISO3 country code (upper case)
     *  @param [filter] {Gender} OPTIONAL
     *  			the (preferred) gender for the voice
     *
     *  @returns {Function} a sorting function that can be used with Array.sort()
     */
    createBestVoiceSort(langCode: string, filter?: Gender): (v1: VoiceDetails, v2: VoiceDetails) => number;
    /**
     * cached result of last invocation of getBestVoice()
     *
     * @type {voice: Voice, language: String, filter: String}
     *
     * @field voice {name: STRING, language: STRING, gender: Gender}
     * 				the voice that was selected, when getBestVoice() was (successfully) called last time
     * @field language {String} the language code that was specified when selecting voice as "best voice":
     *                          the ISO3 language code (lower case), optionally with ISO3 country code (upper case)
     * @field [filter] {String} the filter/gender that was specified when selecting voice as "best voice":
     *                          Gender
     */
    protected _lastBestVoice: VoiceResult;
    /**
     * cached result of last invocation of ttsSelectVoiceFor()
     *
     * @type {voice: Voice, language: String, filter: String}
     *
     * @field voice {name: STRING, language: STRING, gender: Gender}
     * 				the voice that was selected, when getBestVoice() was (successfully) called last time
     * @field language {String} the language code that was specified when selecting voice as "best voice":
     *                          the ISO3 language code (lower case), optionally with ISO3 country code (upper case)
     * @field [filter] {String} the filter/gender that was specified when selecting voice as "best voice":
     *                          Gender
     */
    protected _lastSelectedVoice: VoiceResult;
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
    getBestVoice(langCode: string, gender?: Gender): VoiceResult;
    /**
     * select a voice by its name or by filter (gender) and language-code
     *
     * @param  {string} langCode the language-code (may include a country-code); NOTE if a voice-name matches, the langCode is ignored!
     * @param  {string} query the voice name or filter-query; if FALSY the first matching voice for langCode will be used
     * @return {Voice} the voice matching the query (may be a "best match", i.e. not exactly match the query)
     */
    ttsSelectVoiceFor(langCode: string, query?: Gender | string): VoiceDetails;
}
