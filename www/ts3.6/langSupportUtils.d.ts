import { VoiceDetails } from 'mmir-lib';
/** transformation for raw data to gender string */
export declare type GenderParseFunc = (gender: string) => 'female' | 'male';
export declare type Gender = "female" | "male";
export interface LabeledVoiceDetails extends VoiceDetails {
    label: string;
}
export interface VoiceResult {
    voice: LabeledVoiceDetails;
    language: string;
    filter: string;
}
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
/** metadata definition for how to access a data row/object for specific fields */
export interface LanguageSupportIndex {
    /** name/index for TTS (language) code field */
    ttsCode: number | string;
    /** name/index for TTS (voice) name field */
    ttsName: number | string;
    /** name/index for TTS (voice) gender field */
    ttsGender: number | string;
    /** name/index for (OPTIONAL) TTS (voice) label field */
    ttsLabel?: number | string;
    /** name/index for (OPTIONAL) TTS (voice) "is locally available" field */
    ttsLocal?: number | string;
    /** name/index for ASR (language) label field */
    asrLabel: number | string;
    /** name/index for ASR (language) code field */
    asrCode: number | string;
}
export declare type LanguageResourceEntry = string[] | {
    [field: string]: string;
};
export declare class LanguageSupport {
    asrLanguages: LanguageResourceEntry[];
    ttsLanguages: LanguageResourceEntry[];
    parseGender: GenderParseFunc;
    /** name/index for TTS (language) code field */
    ttsCode: number | string;
    /** name/index for TTS (voice) name field */
    ttsName: number | string;
    /** name/index for TTS (voice) gender field */
    ttsGender: number | string;
    /** name/index for (OPTIONAL) TTS (voice) label field */
    ttsLabel?: number | string;
    /** name/index for (OPTIONAL) TTS (voice) "is locally available" field */
    ttsLocal?: number | string;
    /** name/index for ASR (language) label field */
    asrLabel: number | string;
    /** name/index for ASR (language) code field */
    asrCode: number | string;
    /**
     * if TTS voices are locally (without network/internet) availabled:
     * Can be set manually, to indicate local availibility for all voices.
     *
     * If `listIndices: LanguageSupportIndex`
     *
     * If unset (i.e. `undefined`), no information regarding local
     * availability is available; it should be assumed, that network/internet resources
     * may be required for the voice(s).
     */
    isLocal: boolean | undefined;
    /**
     * if TTS voices do have an additional information about local availability:
     * detected during initialization, when `listIndices: LanguageSupportIndex`
     * has a `ttsLocal` field.
     */
    readonly hasLocal: boolean;
    /**
     * if TTS voices do have an additional (human readable) name:
     * detected during initialization, when `listIndices: LanguageSupportIndex`
     * has a `ttsLabel` field.
     */
    readonly hasLabel: boolean;
    /**
     * transformation function for TTS voice name, used when querying for a voice;
     * can be set via constructor.
     *
     * DEFAULT: use voice name as is (i.e. unchanged).
     */
    readonly voiceSelectFilter: (voiceName: string) => string;
    constructor(asrLanguages: LanguageResourceEntry[], ttsLanguages: LanguageResourceEntry[], parseGender: GenderParseFunc, listIndices: LanguageSupportIndex, voiceSelectFilter?: (voiceName: string) => string);
    ttsProjection: {
        [type: string]: (entry: LanguageResourceEntry, index?: number, list?: LanguageResourceEntry[]) => string | LabeledVoiceDetails;
    };
    /** get list of supported TTS language codes */
    getTTS(type: "code"): string[];
    /** get list of supported TTS languages (i.e. language labels) */
    getTTS(type: "label"): string[];
    /** get list of supported TTS voice details (OPTIONAL: filter for language (code) and/or voice gender) */
    getTTS(type: "voice", langCode?: string, gender?: Gender): LabeledVoiceDetails[];
    /** get list of supported TTS voices (OPTIONAL: filter for language (code) and/or voice gender) */
    getTTS(type: "voiceName", langCode?: string, gender?: Gender): string[];
    asrProjection: {
        [type: string]: (entry: LanguageResourceEntry, index?: number, list?: LanguageResourceEntry[]) => string;
    };
    /**
     * query for ASR language
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
    createBestVoiceSort(langCode: string, filter?: Gender): (v1: LabeledVoiceDetails, v2: LabeledVoiceDetails) => number;
    /**
     * if cached results for best voice / selected voice should be used:
     * should be disabled, if underlying TTS voice list is created dynamically/changes.
     *
     * @default true
     *
     * @see getBestVoice
     * @see ttsSelectVoiceFor
     * @see resetVoiceQueryCache
     */
    useVoiceQueryCache: boolean;
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
     * reset cached results for best matching voice and last selected voice
     *
     * @see useVoiceQueryCache
     */
    resetVoiceQueryCache(): void;
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
    ttsSelectVoiceFor(langCode: string, query?: Gender | string): LabeledVoiceDetails;
}
