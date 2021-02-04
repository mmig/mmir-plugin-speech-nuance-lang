define(() => /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./res/web-dist.ts":
/*!*************************!*\
  !*** ./res/web-dist.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.languages = exports.languageSupport = void 0;
var languageSupport = __webpack_require__(/*! ../src/languageSupport */ "./src/languageSupport.ts");
exports.languageSupport = languageSupport;
var languages = __webpack_require__(/*! ../src/languages */ "./src/languages.ts");
exports.languages = languages;


/***/ }),

/***/ "./src/langSupportUtils.ts":
/*!*********************************!*\
  !*** ./src/langSupportUtils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LanguageSupport = exports.normalizeCode = void 0;
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
                    label: _this.hasLabel ? item[_this.ttsLabel] : item[_this.ttsName],
                    language: item[_this.ttsCode],
                    gender: _this.parseGender(item[_this.ttsGender]),
                    local: _this.hasLocal ? item[_this.ttsLocal] : _this.isLocal
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
         * if cached results for best voice / selected voice should be used:
         * should be disabled, if underlying TTS voice list is created dynamically/changes.
         *
         * @default true
         *
         * @see getBestVoice
         * @see ttsSelectVoiceFor
         * @see resetVoiceQueryCache
         */
        this.useVoiceQueryCache = true;
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
        this.hasLabel = false;
        this.hasLocal = false;
        for (var n in listIndices) {
            if (n === 'ttsLabel' && typeof listIndices[n] !== 'undefined') {
                this.hasLabel = true;
            }
            if (n === 'ttsLocal' && typeof listIndices[n] !== 'undefined') {
                this.hasLocal = true;
            }
            this[n] = listIndices[n];
        }
        this.voiceSelectFilter = voiceSelectFilter ? voiceSelectFilter : function (s) { return s; };
    }
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
     * query for ASR language
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
     * reset cached results for best matching voice and last selected voice
     *
     * @see useVoiceQueryCache
     */
    LanguageSupport.prototype.resetVoiceQueryCache = function () {
        this._lastBestVoice = null;
        this._lastSelectedVoice = null;
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
    LanguageSupport.prototype.getBestVoice = function (langCode, gender) {
        //normalize FALSY values for gender query:
        gender = gender || void (0);
        if (this.useVoiceQueryCache && this._lastBestVoice && this._lastBestVoice.language === langCode && this._lastBestVoice.filter === gender) {
            // console.log('  ######## using cached _lastBestVoice ', _lastBestVoice);
            return this._lastBestVoice;
        }
        // console.log('-----------------------------\nno match for cached _lastBestVoice ', _lastBestVoice);
        var langParts = langCode.split(/[-_]/);
        var lang = langParts[0];
        var list = this.getTTS('voice', lang);
        if (this.useVoiceQueryCache && list.length > 0) {
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
        if (this.useVoiceQueryCache && this._lastSelectedVoice && this._lastSelectedVoice.language === langCode && this._lastSelectedVoice.filter === query) {
            // console.log('  ######## using cached _lastSelectedVoice ', _lastSelectedVoice);
            return this._lastSelectedVoice.voice;
        }
        // console.log('-----------------------------\nno match for cached _lastSelectedVoice ', _lastSelectedVoice);
        //1. try to get voice by name:
        var re = new RegExp('^' + query + '$', 'i');
        var voiceEntry = this.ttsLanguages.find(function (voiceData) {
            var name = voiceData[_this.ttsName];
            if (re.test(name) || re.test(_this.voiceSelectFilter(name))) {
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
        if (this.useVoiceQueryCache && voice) {
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


/***/ }),

/***/ "./src/languageSupport.ts":
/*!********************************!*\
  !*** ./src/languageSupport.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ttsVoicesLocal = exports.ttsSelectVoice = exports.asrLanguages = exports.ttsBestVoiceFor = exports.ttsVoiceNames = exports.ttsVoices = exports.ttsLanguages = exports.LanguageSupport = void 0;
var languages_1 = __webpack_require__(/*! ./languages */ "./src/languages.ts");
var langSupportUtils_1 = __webpack_require__(/*! ./langSupportUtils */ "./src/langSupportUtils.ts");
var langSupportUtils_2 = __webpack_require__(/*! ./langSupportUtils */ "./src/langSupportUtils.ts");
Object.defineProperty(exports, "LanguageSupport", ({ enumerable: true, get: function () { return langSupportUtils_2.LanguageSupport; } }));
var genderType = {
    'F': 'female',
    'M': 'male',
};
var nuanceLangSupport = new langSupportUtils_1.LanguageSupport(languages_1.asrLanguages, languages_1.ttsLanguages, function parseGender(gender) {
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
}, function selectVoiceFilter(voiceName) {
    // remove "-ML" suffix from voice name, if present, before matching with queried search string:
    return voiceName.replace(/-ML$/, '');
});
nuanceLangSupport.isLocal = false;
function ttsLanguages() { return nuanceLangSupport.getTTS('code'); }
exports.ttsLanguages = ttsLanguages;
;
function ttsVoices(langCode, gender) { return nuanceLangSupport.getTTS('voice', langCode, gender); }
exports.ttsVoices = ttsVoices;
;
function ttsVoiceNames(langCode, gender) { return nuanceLangSupport.getTTS('voiceName', langCode, gender); }
exports.ttsVoiceNames = ttsVoiceNames;
;
function ttsBestVoiceFor(langCode, gender) { return nuanceLangSupport.getBestVoice(langCode, gender); }
exports.ttsBestVoiceFor = ttsBestVoiceFor;
;
function asrLanguages() { return nuanceLangSupport.getASR('code'); }
exports.asrLanguages = asrLanguages;
;
function ttsSelectVoice(langCode, query) { return nuanceLangSupport.ttsSelectVoiceFor(langCode, query); }
exports.ttsSelectVoice = ttsSelectVoice;
;
/** set "local availability" for all voices; DEFAULT false (i.e. network/internet access required for all voices) */
function ttsVoicesLocal(allVoicesLocal) { nuanceLangSupport.isLocal = allVoicesLocal; }
exports.ttsVoicesLocal = ttsVoicesLocal;
;


/***/ }),

/***/ "./src/languages.ts":
/*!**************************!*\
  !*** ./src/languages.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


//from https://developer.nuance.com/public/index.php?task=supportedLanguages
//state: 2019-01
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ttsLanguages = exports.asrLanguages = void 0;
/**
 * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
 */
var ttsLanguages = [
    //[0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
    ["Arabic", "ara-XWW", "Laila", "F"],
    ["Arabic", "ara-XWW", "Maged", "M"],
    ["Arabic", "ara-XWW", "Tarik", "M"],
    ["Bahasa (Indonesia)", "ind-IDN", "Damayanti", "F"],
    ["Basque", "baq-ESP", "Miren", "F"],
    ["Cantonese", "yue-CHN", "Sin-Ji", "F"],
    ["Catalan", "cat-ESP", "Jordi", "M"],
    ["Catalan", "cat-ESP", "Montserrat", "F"],
    ["Czech", "ces-CZE", "Iveta", "F"],
    ["Czech", "ces-CZE", "Zuzana", "F"],
    ["Danish", "dan-DNK", "Ida", "F"],
    ["Danish", "dan-DNK", "Magnus", "M"],
    ["Dutch", "nld-NLD", "Claire", "F"],
    ["Dutch", "nld-NLD", "Xander", "M"],
    ["Dutch (Belgium)", "nld-BEL", "Ellen", "F"],
    ["English (Australia)", "eng-AUS", "Karen", "F"],
    ["English (Australia)", "eng-AUS", "Lee", "M"],
    ["English (GB)", "eng-GBR", "Kate", "F"],
    ["English (GB)", "eng-GBR", "Serena", "F"],
    ["English (GB)", "eng-GBR", "Daniel", "M"],
    ["English (GB)", "eng-GBR", "Oliver", "M"],
    ["English (India)", "eng-IND", "Veena", "F"],
    ["English (Ireland)", "eng-IRL", "Moira", "F"],
    ["English (Scotland)", "eng-SCT", "Fiona", "F"],
    ["English (South Africa)", "eng-ZAF", "Tessa", "F"],
    ["English (US)", "eng-USA", "Ava", "F"],
    ["English (US)", "eng-USA", "Allison", "F"],
    ["English (US)", "eng-USA", "Samantha", "F"],
    ["English (US)", "eng-USA", "Susan", "F"],
    ["English (US)", "eng-USA", "Zoe", "F"],
    ["English (US)", "eng-USA", "Tom", "M"],
    ["Finnish", "fin-FIN", "Satu", "F"],
    ["French", "fra-FRA", "Audrey-ML", "F"],
    ["French", "fra-FRA", "Thomas", "M"],
    ["French", "fra-FRA", "Aurelie", "F"],
    ["French (Canada)", "fra-CAN", "Amelie", "F"],
    ["French (Canada)", "fra-CAN", "Chantal", "F"],
    ["French (Canada)", "fra-CAN", "Nicolas", "M"],
    ["Galician", "glg-ESP", "Carmela", "F"],
    ["German", "deu-DEU", "Anna-ML", "F"],
    ["German", "deu-DEU", "Petra-ML", "F"],
    ["German", "deu-DEU", "Markus", "M"],
    ["German", "deu-DEU", "Yannick", "M"],
    ["Greek", "ell-GRC", "Melina", "F"],
    ["Greek", "ell-GRC", "Nikos", "M"],
    ["Hebrew", "heb-ISR", "Carmit", "F"],
    ["Hindi", "hin-IND", "Lekha", "F"],
    ["Hungarian", "hun-HUN", "Mariska", "F"],
    ["Italian", "ita-ITA", "Alice-ML", "F"],
    ["Italian", "ita-ITA", "Federica", "F"],
    ["Italian", "ita-ITA", "Paola", "F"],
    ["Italian", "ita-ITA", "Luca", "M"],
    ["Japanese", "jpn-JPN", "Kyoko", "F"],
    ["Japanese", "jpn-JPN", "Otoya", "M"],
    ["Korean", "kor-KOR", "Sora", "F"],
    ["Mandarin (China)", "cmn-CHN", "Tian-Tian", "F"],
    ["Mandarin (Taiwan)", "cmn-TWN", "Mei-Jia", "F"],
    ["Norwegian", "nor-NOR", "Nora", "F"],
    ["Norwegian", "nor-NOR", "Henrik", "M"],
    ["Polish", "pol-POL", "Ewa", "F"],
    ["Polish", "pol-POL", "Zosia", "F"],
    ["Portuguese (Brazil)", "por-BRA", "Luciana", "F"],
    ["Portuguese (Brazil)", "por-BRA", "Felipe", "M"],
    ["Portuguese (Portugal)", "por-PRT", "Catarina", "F"],
    ["Portuguese (Portugal)", "por-PRT", "Joana", "F"],
    ["Romanian", "ron-ROU", "Ioana", "F"],
    ["Russian", "rus-RUS", "Katya", "F"],
    ["Russian", "rus-RUS", "Milena", "F"],
    ["Russian", "rus-RUS", "Yuri", "M"],
    ["Slovak", "slk-SVK", "Laura", "F"],
    ["Spanish (Castilian)", "spa-ESP", "Monica", "F"],
    ["Spanish (Castilian)", "spa-ESP", "Jorge", "M"],
    ["Spanish (Columbia)", "spa-COL", "Soledad", "F"],
    ["Spanish (Columbia)", "spa-COL", "Carlos", "M"],
    ["Spanish (Mexico)", "spa-MEX", "Angelica", "F"],
    ["Spanish (Mexico)", "spa-MEX", "Paulina", "F"],
    ["Spanish (Mexico)", "spa-MEX", "Juan", "M"],
    ["Swedish", "swe-SWE", "Alva", "F"],
    ["Swedish", "swe-SWE", "Oskar", "M"],
    ["Thai", "tha-THA", "Kanya", "F"],
    ["Turkish", "tur-TUR", "Cem", "M"],
    ["Turkish", "tur-TUR", "Yelda", "F"],
    ["Valencian", "spa-ESP", "Empar", "F"]
];
exports.ttsLanguages = ttsLanguages;
/**
 * [0] Language, [1]	6 char *, [2]	Frequency
 */
var asrLanguages = [
    //	[0] Language, [1]	6 char *, [2]	Frequency
    ["Arabic (Egypt)", "ara-EGY", "8 kHz, 16 kHz"],
    ["Arabic (Saudi Arabia)", "ara-SAU", "8 kHz, 16 kHz"],
    ["Arabic (International)", "ara-XWW", "8 kHz, 16 kHz"],
    ["Bahasa (Indonesia)", "ind-IDN", "8 kHz, 16 kHz"],
    ["Cantonese (Simplified)", "yue-CHN", "8 kHz, 16 kHz"],
    ["Catalan", "cat-ESP", "8 kHz, 16 kHz"],
    ["Croatian ", "hrv-HRV", "8 kHz, 16 kHz"],
    ["Czech", "ces-CZE", "8 kHz, 16 kHz"],
    ["Danish", "dan-DNK", "8 kHz, 16 kHz"],
    ["Dutch", "nld-NLD", "8 kHz, 16 kHz"],
    ["English (Australia)*", "eng-AUS", "8 kHz, 16 kHz"],
    ["English (GB)*", "eng-GBR", "8 kHz, 16 kHz"],
    ["English (US)*", "eng-USA", "8 kHz, 16 kHz"],
    ["English (India) ", "eng-IND", "8 kHz, 16 kHz"],
    ["Finnish", "fin-FIN", "8 kHz, 16 kHz"],
    ["French (Canada)", "fra-CAN", "8 kHz, 16 kHz"],
    ["French (France)*", "fra-FRA", "8 kHz, 16 kHz"],
    ["German*", "deu-DEU", "8 kHz, 16 kHz"],
    ["Greek", "ell-GRC", "8 kHz, 16 kHz"],
    ["Hebrew", "heb-ISR", "8 kHz, 16 kHz"],
    ["Hindi", "hin-IND", "8 kHz, 16 kHz"],
    ["Hungarian", "hun-HUN", "8 kHz, 16 kHz"],
    ["Italian", "ita-ITA", "8 kHz, 16 kHz"],
    ["Japanese", "jpn-JPN", "8 kHz, 16 kHz"],
    ["Korean", "kor-KOR", "8 kHz, 16 kHz"],
    ["Malay", "zlm-MYS", "8 kHz, 16 kHz"],
    ["Mandarin (China/Simplified)", "cmn-CHN", "8 kHz, 16 kHz"],
    ["Mandarin (Taiwan/Traditional)", "cmn-TWN", "8 kHz, 16 kHz"],
    ["Norwegian", "nor-NOR", "8 kHz, 16 kHz"],
    ["Polish", "pol-POL", "8 kHz, 16 kHz"],
    ["Portuguese (Brazil)", "por-BRA", "8 kHz, 16 kHz"],
    ["Portuguese (Portugal)", "por-PRT", "8 kHz, 16 kHz"],
    ["Romanian", "ron-ROU", "8 kHz, 16 kHz"],
    ["Russian", "rus-RUS", "8 kHz, 16 kHz"],
    ["Slovak", "slk-SVK", "8 kHz, 16 kHz"],
    ["Spanish (Spain)", "spa-ESP", "8 kHz, 16 kHz"],
    ["Spanish (LatAm)", "spa-XLA", "8 kHz, 16 kHz"],
    ["Swedish", "swe-SWE", "8 kHz, 16 kHz"],
    ["Thai", "tha-THA", "8 kHz, 16 kHz"],
    ["Turkish", "tur-TUR", "8 kHz, 16 kHz"],
    ["Ukrainian", "ukr-UKR", "8 kHz, 16 kHz"],
    ["Vietnamese", "vie-VNM", "8 kHz, 16 kHz"]
];
exports.asrLanguages = asrLanguages;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./res/web-dist.ts");
/******/ })()
);;
//# sourceMappingURL=languageSupport.js.map