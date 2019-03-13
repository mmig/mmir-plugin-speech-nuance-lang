
var languages = require('./languages');

/**
 * TTS languages & voices:
 * list of arrays, where an array in the list contains
 * <pre>
 * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
 * </pre>
 * @type Array<Array<string>>
 */
var ttsLanguages = languages.ttsLanguages;

/**
 * ASR languages:
 * list of arrays, where an array in the list contains
 * <pre>
 * [0] Language, [1]	6 char *, [2]	Frequency
 * </pre>
 * @type Array<Array<string>>
 */
var asrLanguages = languages.asrLanguages;

var genderType = {
	'F': 'female',	//map: list-entry -> type
	'M': 'male',	//map: list-entry -> type
	'female': 'F',	//map: type -> list-entry
	'male': 'M'		//map: type -> list-entry
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
function normalizeCode(code){
  return code.replace(/^([^_-]+)(-|_)?(\w+)?$/, function(_match, lang, sep, country){
    return (lang? lang.toLowerCase() : '') + (sep? '-' : '') + (country? country.toUpperCase() : '');
  });
}

var ttsProjection = {
	'code': function(item){
		return item[1];
	},
	'label': function(item){
		return item[0];
	},
	'voice': function(item){
		return {
			name: item[2],
			language: item[1],
			gender: genderType[ item[3] ]
		};
	},
	'voiceName': function(item){
		return item[2];
	}
};

/**
 *
 * @param type {"code" | "label" | "voice" | "voiceName"}
 * 					type of returned list: language code, language name, voice information, voice-name
 * @param [langCode] {String} OPTIONAL
 * 				if present for  "voice" or "voiceName", only voices with matching language code will be returned
 * 				Format: ISO3 language-code (lower-case) and optional ISO3 country-code (upper case), e.g. "eng-USA", "spa_ESP", "deu"
 * @param [gender] {"female" | "male"} OPTIONAL
 * 				if present for  "voice" or "voiceName", only voices with matching gender will be returned
 *
 * @returns {VoiceInfo} list of strings, depending on type parameter; in case of "voice" a list of voice-objects:
 * 				{name: STRING, language: STRING, gender: "female" | "male"}
 */
function getTTS(type, langCode, gender){

	var isVoiceQuery = type === 'voice' || type === 'voiceName';
	var list = isVoiceQuery? ttsLanguages : ttsLanguages.filter(function(item, index, array){
		if(index === 0 || array[index - 1][1] !== item[1]){
			return item;
		}
	});

	if(langCode && isVoiceQuery){

		//allow - and _ as separator:
		var re = new RegExp('^' + normalizeCode(langCode) + '\\b');

		list = list.filter(function(item){
			if(re.test(item[1])){
				return !gender || gender === genderType[ item[3] ]? true : false;
			}
		});
	}
	return list.map(ttsProjection[type]);
}

var asrProjection = {
	'code': function(item){
		return item[1];
	},
	'label': function(item){
		return item[0];
	}
};

/**
 *
 * @param type "code" | "label"
 * 					type of returned list: language code, language name
 *
 * @returns {Array<string>} list of strings of language codes or names
 */
function getASR(type){
	return asrLanguages.map(asrProjection[type]);
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
 *  @param [filter] {"female" | "male"} OPTIONAL
 *  			the (preferred) gender for the voice
 *
 *  @returns {Function} a sorting function that can be used with Array.sort()
 */
var createBestVoiceSort = function(langCode, filter) {

	langCode = normalizeCode(langCode);
	var hasCountry = /^\w+-\w+$/.test(langCode);

	return function(v1, v2) {

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

		return v1.name.localeCompare(v2.name);
	}
};

/**
 * cached result of last invocation of getBestVoice()
 *
 * @type {voice: Voice, language: String, filter: String}
 *
 * @field voice {name: STRING, language: STRING, gender: "female" | "male"}
 * 				the voice that was selected, when getBestVoice() was (successfully) called last time
 * @field language {String} the language code that was specified when selecting voice as "best voice":
 *                          the ISO3 language code (lower case), optionally with ISO3 country code (upper case)
 * @field [filter] {String} the filter/gender that was specified when selecting voice as "best voice":
 *                          "female" | "male"
 */
var _lastBestVoice = null;

/**
 * cached result of last invocation of ttsSelectVoice()
 *
 * @type {voice: Voice, language: String, filter: String}
 *
 * @field voice {name: STRING, language: STRING, gender: "female" | "male"}
 * 				the voice that was selected, when getBestVoice() was (successfully) called last time
 * @field language {String} the language code that was specified when selecting voice as "best voice":
 *                          the ISO3 language code (lower case), optionally with ISO3 country code (upper case)
 * @field [filter] {String} the filter/gender that was specified when selecting voice as "best voice":
 *                          "female" | "male"
 */
var _lastSelectedVoice = null;

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
function getBestVoice(langCode, gender) {

  //normalize FALSY values for gender query:
  gender = gender || void(0);

	if(_lastBestVoice && _lastBestVoice.language === langCode && _lastBestVoice.filter === gender){
    // console.log('  ######## using cached _lastBestVoice ', _lastBestVoice);
		return _lastBestVoice;
	}
  // console.log('-----------------------------\nno match for cached _lastBestVoice ', _lastBestVoice);

	var langParts = langCode.split(/[-_]/);
	var lang = langParts[0];

	var list = getTTS('voice', lang);

	if(list.length > 0){
		list.sort(createBestVoiceSort(langCode, gender));
		_lastBestVoice = {
			voice: list[0],
			language: langCode,
			filter: gender
		};
		return _lastBestVoice;
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
function ttsSelectVoice(langCode, query){

  //normalize FALSY values for query & langCode:
  query = query || void(0);
  langCode = langCode || '';

  if(_lastSelectedVoice && _lastSelectedVoice.language === langCode && _lastSelectedVoice.filter === query){
    // console.log('  ######## using cached _lastSelectedVoice ', _lastSelectedVoice);
    return _lastSelectedVoice.voice;
  }
  // console.log('-----------------------------\nno match for cached _lastSelectedVoice ', _lastSelectedVoice);

  //1. try to get voice by name:
  var re = new RegExp('^' + query + '$', 'i');
  var voice = ttsLanguages.find(function(voiceData){
    if(re.test(voiceData[2].replace(/-ML$/, ''))){
      return true;
    }
    return false;
  });

  if(voice){
    voice = ttsProjection.voice(voice);
  } else{
    //2. get best matching voice for langCode & query
    var bestMatch = getBestVoice(langCode, query);
    if(bestMatch){
      voice = bestMatch.voice;
    }
  }

  if(voice){
    _lastSelectedVoice = {
      voice: voice,
      language: langCode,
      filter: query
    };
  }

  return voice;
}

module.exports = {
    ttsLanguages: function(){ return getTTS('code');},
    ttsVoices: function(langCode, gender){ return getTTS('voice', langCode, gender);},
    ttsVoiceNames: function(langCode, gender){ return getTTS('voiceName', langCode, gender);},
    ttsBestVoiceFor: getBestVoice,
    asrLanguages: function(){ return getASR('code');},
    ttsSelectVoice: ttsSelectVoice
};
