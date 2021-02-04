
// import { asrLanguages as asrLanguageList , ttsLanguages as ttsLanguageList } from './languages';
import { VoiceDetails } from 'mmir-lib';

/** transformation for raw data to gender string */
export type GenderParseFunc = (gender: string) => 'female' | 'male';
// const genderType = {
// 	'F': 'female',	//map: list-entry -> type
// 	'M': 'male',	//map: list-entry -> type
// 	'female': 'F',	//map: type -> list-entry
// 	'male': 'M'		//map: type -> list-entry
// }

export type Gender = "female" | "male";
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
export function normalizeCode(code: string): string {
  return code.replace(/^([^_-]+)(-|_)?(\w+)?$/, (_match, lang, sep, country) => {
    return (lang? lang.toLowerCase() : '') + (sep? '-' : '') + (country? country.toUpperCase() : '');
  });
}

/** metadata definition for how to access a data row/object for specific fields */
export interface LanguageSupportIndex {

  // e.g. [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F

  /** name/index for TTS (language) code field */
  ttsCode: number|string;
  /** name/index for TTS (voice) name field */
  ttsName: number|string;
  /** name/index for TTS (voice) gender field */
  ttsGender: number|string;
  /** name/index for (OPTIONAL) TTS (voice) label field */
  ttsLabel?: number|string;
  /** name/index for (OPTIONAL) TTS (voice) "is locally available" field */
  ttsLocal?: number|string;

  // e.g. [0] Language, [1]	6 char *, [2]	Frequency

  /** name/index for ASR (language) label field */
  asrLabel: number|string;
  /** name/index for ASR (language) code field */
  asrCode: number|string;
}

export type LanguageResourceEntry = string[] | {[field: string]: string};

export class LanguageSupport {

  /** name/index for TTS (language) code field */
  ttsCode: number|string;
  /** name/index for TTS (voice) name field */
  ttsName: number|string;
  /** name/index for TTS (voice) gender field */
  ttsGender: number|string;
  /** name/index for (OPTIONAL) TTS (voice) label field */
  ttsLabel?: number|string;
  /** name/index for (OPTIONAL) TTS (voice) "is locally available" field */
  ttsLocal?: number|string;

  /** name/index for ASR (language) label field */
  asrLabel: number|string;
  /** name/index for ASR (language) code field */
  asrCode: number|string;

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

  constructor(
    public asrLanguages: LanguageResourceEntry[],
    public ttsLanguages: LanguageResourceEntry[],
    public parseGender: GenderParseFunc,
    listIndices: LanguageSupportIndex,
    voiceSelectFilter?: (voiceName: string) => string
  ){
    this.hasLabel = false;
    this.hasLocal = false;
    for(const n in listIndices){
      if(n === 'ttsLabel' && typeof listIndices[n] !== 'undefined'){
        this.hasLabel = true;
      }
      if(n === 'ttsLocal' && typeof listIndices[n] !== 'undefined'){
        this.hasLocal = true;
      }
      this[n] = listIndices[n];
    }
    this.voiceSelectFilter = voiceSelectFilter? voiceSelectFilter : (s: string) => s;
  }

  ttsProjection: {[type: string]: (entry: LanguageResourceEntry, index?: number, list?: LanguageResourceEntry[]) => string|LabeledVoiceDetails} = {
    'code': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): string => {
      return item[this.ttsCode];
    },
    'label': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): string => {
      return item[this.ttsLabel];
    },
    'voice': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): LabeledVoiceDetails => {
      return {
        name: item[this.ttsName],
        label: this.hasLabel? item[this.ttsLabel] : item[this.ttsName],
        language: item[this.ttsCode],
        gender: this.parseGender( item[this.ttsGender] ),
        local: this.hasLocal? item[this.ttsLocal] : this.isLocal
      }
    },
    'voiceName': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): string => {
      return item[this.ttsName];
    }
  }

  /** get list of supported TTS language codes */
  getTTS(type: "code"): string[];
  /** get list of supported TTS languages (i.e. language labels) */
  getTTS(type: "label"): string[];
  /** get list of supported TTS voice details (OPTIONAL: filter for language (code) and/or voice gender) */
  getTTS(type: "voice", langCode?: string, gender?: Gender): LabeledVoiceDetails[];
  /** get list of supported TTS voices (OPTIONAL: filter for language (code) and/or voice gender) */
  getTTS(type: "voiceName", langCode?: string, gender?: Gender): string[];
  /**
   * query for TTS languages for voices
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
  getTTS(type: "code" | "label" | "voice" | "voiceName", langCode?: string, gender?: Gender): (string | LabeledVoiceDetails)[] {

    const isVoiceQuery = type === 'voice' || type === 'voiceName';
    let list = isVoiceQuery? this.ttsLanguages : this.ttsLanguages.filter((item, index, array) => {
      if(index === 0 || array[index - 1][this.ttsCode] !== item[this.ttsCode]){
        return item;
      }
    });

    if(langCode && isVoiceQuery){

      //allow - and _ as separator:
      const re = new RegExp('^' + normalizeCode(langCode) + '\\b');

      list = list.filter(item => {
        if(re.test(item[this.ttsCode])){
          return !gender || gender === this.parseGender( item[this.ttsGender] )? true : false;
        }
      });
    }
    return list.map(this.ttsProjection[type]);
  }

  asrProjection: {[type: string]: (entry: LanguageResourceEntry, index?: number, list?: LanguageResourceEntry[]) => string}  = {
    'code': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): string => {
      return item[this.asrCode];
    },
    'label': (item: LanguageResourceEntry, _index: number, _list: LanguageResourceEntry[]): string => {
      return item[this.asrLabel];
    }
  }

  /**
   * query for ASR language
   *
   * @param type "code" | "label"
   * 					type of returned list: language code, language name
   *
   * @returns {Array<string>} list of strings of language codes or names
   */
  getASR(type: "code" | "label"): string[] {
    return this.asrLanguages.map(this.asrProjection[type]);
  }

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
  createBestVoiceSort(langCode: string, filter?: Gender): (v1: LabeledVoiceDetails, v2: LabeledVoiceDetails) => number {

    langCode = normalizeCode(langCode);
    var hasCountry = /^\w+-\w+$/.test(langCode);

    return (v1, v2) => {

      if(filter && v1.gender !== v2.gender){
        if(v1.gender === filter){
          return  -1;
        } else if(v2.gender === filter){
          return 1;
        }
      }

      if(v1.language !== v2.language){

        if(hasCountry){
          if(v1.language === langCode){
            return -1;
          } else if(v2.language === langCode){
            return 1;
          }
        }

        return v1.language.localeCompare(v2.language);
      }


      if(v1.language !== v2.language){

        if(hasCountry){
          if(v1.language === langCode){
            return -1;
          } else if(v2.language === langCode){
            return 1;
          }
        }

        return v1.language.localeCompare(v2.language);
      }

      return v1.name.localeCompare(v2.name);
    }
  };

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
  public useVoiceQueryCache: boolean = true;

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
  protected _lastBestVoice: VoiceResult = null;

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
  protected _lastSelectedVoice: VoiceResult = null;

  /**
   * reset cached results for best matching voice and last selected voice
   *
   * @see useVoiceQueryCache
   */
  public resetVoiceQueryCache(): void {
    this._lastBestVoice = null;
    this._lastSelectedVoice = null;
  }

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
  getBestVoice(langCode: string, gender?: Gender): VoiceResult {

    //normalize FALSY values for gender query:
    gender = gender || void(0);

    if(this.useVoiceQueryCache && this._lastBestVoice && this._lastBestVoice.language === langCode && this._lastBestVoice.filter === gender){
      // console.log('  ######## using cached _lastBestVoice ', _lastBestVoice);
      return this._lastBestVoice;
    }
    // console.log('-----------------------------\nno match for cached _lastBestVoice ', _lastBestVoice);

    const langParts = langCode.split(/[-_]/);
    const lang = langParts[0];

    const list = this.getTTS('voice', lang) as LabeledVoiceDetails[];

    if(this.useVoiceQueryCache && list.length > 0){
      list.sort(this.createBestVoiceSort(langCode, gender));
      this._lastBestVoice = {
        voice: list[0],
        language: langCode,
        filter: gender
      };
      return this._lastBestVoice;
    }
    return null;
  }

  /**
   * select a voice by its name or by filter (gender) and language-code
   *
   * @param  {string} langCode the language-code (may include a country-code); NOTE if a voice-name matches, the langCode is ignored!
   * @param  {string} query the voice name or filter-query; if FALSY the first matching voice for langCode will be used
   * @return {Voice} the voice matching the query (may be a "best match", i.e. not exactly match the query)
   */
  ttsSelectVoiceFor(langCode: string, query?: Gender | string): LabeledVoiceDetails {

    //normalize FALSY values for query & langCode:
    query = query || void(0);
    langCode = langCode || '';

    if(this.useVoiceQueryCache && this._lastSelectedVoice && this._lastSelectedVoice.language === langCode && this._lastSelectedVoice.filter === query){
      // console.log('  ######## using cached _lastSelectedVoice ', _lastSelectedVoice);
      return this._lastSelectedVoice.voice;
    }
    // console.log('-----------------------------\nno match for cached _lastSelectedVoice ', _lastSelectedVoice);

    //1. try to get voice by name:
    const re = new RegExp('^' + query + '$', 'i');
    const voiceEntry = this.ttsLanguages.find((voiceData: string[]) => {
      const name = voiceData[this.ttsName];
      if(re.test(name) || re.test(this.voiceSelectFilter(name))){
        return true;
      }
      return false;
    });

    let voice: LabeledVoiceDetails;
    if(voiceEntry){
      voice = this.ttsProjection.voice(voiceEntry) as LabeledVoiceDetails;
    } else{
      //2. get best matching voice for langCode & query
      const bestMatch = this.getBestVoice(langCode, query as Gender);
      if(bestMatch){
        voice = bestMatch.voice;
      }
    }

    if(this.useVoiceQueryCache && voice){
      this._lastSelectedVoice = {
        voice: voice,
        language: langCode,
        filter: query
      };
    }

    return voice;
  }
}
