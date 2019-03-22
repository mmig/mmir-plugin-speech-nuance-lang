"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * normalize language code, optionally including separator & country-code:
 *  * language code to lower case
 *  * use '-' as separator
 *  * country code to upper case
 *
 * @param  {string} code [description]
 * @return {string} normalized language (and country) code
 */
function normalizeCode(code) {
    return code.replace(/^([^_-]+)(-|_)?(\w+)?$/, function (_match, lang, sep, country) {
        return (lang ? lang.toLowerCase() : '') + (sep ? '-' : '') + (country ? country.toUpperCase() : '');
    });
}
exports.normalizeCode = normalizeCode;
var LanguageSupport = /** @class */ (function () {
    function LanguageSupport(asrLanguages, ttsLanguages, parseGender, listIndices, voiceSelectFilter) {
        var _this = this;
        this.asrLanguages = asrLanguages;
        this.ttsLanguages = ttsLanguages;
        this.parseGender = parseGender;
        this.ttsProjection = {
            'code': function (item, _index, _list) {
                return item[_this.ttsCode];
            },
            'label': function (item, _index, _list) {
                return item[_this.ttsLabel];
            },
            'voice': function (item, _index, _list) {
                return {
                    name: item[_this.ttsName],
                    language: item[_this.ttsCode],
                    gender: _this.parseGender(item[_this.ttsGender])
                };
            },
            'voiceName': function (item, _index, _list) {
                return item[_this.ttsName];
            }
        };
        this.asrProjection = {
            'code': function (item, _index, _list) {
                return item[_this.asrCode];
            },
            'label': function (item, _index, _list) {
                return item[_this.asrLabel];
            }
        };
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
        this._lastBestVoice = null;
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
        this._lastSelectedVoice = null;
        for (var n in listIndices) {
            this[n] = listIndices[n];
        }
        this.voiceSelectFilter = voiceSelectFilter ? voiceSelectFilter : function (s) { return s; };
    }
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
    LanguageSupport.prototype.getTTS = function (type, langCode, gender) {
        var _this = this;
        var isVoiceQuery = type === 'voice' || type === 'voiceName';
        var list = isVoiceQuery ? this.ttsLanguages : this.ttsLanguages.filter(function (item, index, array) {
            if (index === 0 || array[index - 1][_this.ttsCode] !== item[_this.ttsCode]) {
                return item;
            }
        });
        if (langCode && isVoiceQuery) {
            //allow - and _ as separator:
            var re_1 = new RegExp('^' + normalizeCode(langCode) + '\\b');
            list = list.filter(function (item) {
                if (re_1.test(item[_this.ttsCode])) {
                    return !gender || gender === _this.parseGender(item[_this.ttsGender]) ? true : false;
                }
            });
        }
        return list.map(this.ttsProjection[type]);
    };
    /**
     *
     * @param type "code" | "label"
     * 					type of returned list: language code, language name
     *
     * @returns {Array<string>} list of strings of language codes or names
     */
    LanguageSupport.prototype.getASR = function (type) {
        return this.asrLanguages.map(this.asrProjection[type]);
    };
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
    LanguageSupport.prototype.createBestVoiceSort = function (langCode, filter) {
        langCode = normalizeCode(langCode);
        var hasCountry = /^\w+-\w+$/.test(langCode);
        return function (v1, v2) {
            if (filter && v1.gender !== v2.gender) {
                if (v1.gender === filter) {
                    return -1;
                }
                else if (v2.gender === filter) {
                    return 1;
                }
            }
            if (v1.language !== v2.language) {
                if (hasCountry) {
                    if (v1.language === langCode) {
                        return -1;
                    }
                    else if (v2.language === langCode) {
                        return 1;
                    }
                }
                return v1.language.localeCompare(v2.language);
            }
            return v1.name.localeCompare(v2.name);
        };
    };
    ;
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
    LanguageSupport.prototype.getBestVoice = function (langCode, gender) {
        //normalize FALSY values for gender query:
        gender = gender || void (0);
        if (this._lastBestVoice && this._lastBestVoice.language === langCode && this._lastBestVoice.filter === gender) {
            // console.log('  ######## using cached _lastBestVoice ', _lastBestVoice);
            return this._lastBestVoice;
        }
        // console.log('-----------------------------\nno match for cached _lastBestVoice ', _lastBestVoice);
        var langParts = langCode.split(/[-_]/);
        var lang = langParts[0];
        var list = this.getTTS('voice', lang);
        if (list.length > 0) {
            list.sort(this.createBestVoiceSort(langCode, gender));
            this._lastBestVoice = {
                voice: list[0],
                language: langCode,
                filter: gender
            };
            return this._lastBestVoice;
        }
        return null;
    };
    /**
     * select a voice by its name or by filter (gender) and language-code
     *
     * @param  {string} langCode the language-code (may include a country-code); NOTE if a voice-name matches, the langCode is ignored!
     * @param  {string} query the voice name or filter-query; if FALSY the first matching voice for langCode will be used
     * @return {Voice} the voice matching the query (may be a "best match", i.e. not exactly match the query)
     */
    LanguageSupport.prototype.ttsSelectVoiceFor = function (langCode, query) {
        var _this = this;
        //normalize FALSY values for query & langCode:
        query = query || void (0);
        langCode = langCode || '';
        if (this._lastSelectedVoice && this._lastSelectedVoice.language === langCode && this._lastSelectedVoice.filter === query) {
            // console.log('  ######## using cached _lastSelectedVoice ', _lastSelectedVoice);
            return this._lastSelectedVoice.voice;
        }
        // console.log('-----------------------------\nno match for cached _lastSelectedVoice ', _lastSelectedVoice);
        //1. try to get voice by name:
        var re = new RegExp('^' + query + '$', 'i');
        var voiceEntry = this.ttsLanguages.find(function (voiceData) {
            if (re.test(_this.voiceSelectFilter(voiceData[_this.ttsName]))) {
                return true;
            }
            return false;
        });
        var voice;
        if (voiceEntry) {
            voice = this.ttsProjection.voice(voiceEntry);
        }
        else {
            //2. get best matching voice for langCode & query
            var bestMatch = this.getBestVoice(langCode, query);
            if (bestMatch) {
                voice = bestMatch.voice;
            }
        }
        if (voice) {
            this._lastSelectedVoice = {
                voice: voice,
                language: langCode,
                filter: query
            };
        }
        return voice;
    };
    return LanguageSupport;
}());
exports.LanguageSupport = LanguageSupport;
// export function ttsLanguages (){ return getTTS('code');};
// export function ttsVoices(langCode?: string, gender?: Gender): VoiceDetails[] { return getTTS('voice', langCode, gender) as VoiceDetails[];};
// export function ttsVoiceNames(langCode?: string, gender?: Gender): string[] { return getTTS('voiceName', langCode, gender) as string[];};
// export const ttsBestVoiceFor = getBestVoice;
// export function asrLanguages(): string [] { return getASR('code');};
// export const ttsSelectVoice = ttsSelectVoiceFor;
//# sourceMappingURL=langSupportUtils.js.map