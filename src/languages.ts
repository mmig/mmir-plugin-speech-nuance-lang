
//from https://developer.nuance.com/public/index.php?task=supportedLanguages
//state: 2019-01

/**
 * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
 */
const ttsLanguages = [
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

/**
 * [0] Language, [1]	6 char *, [2]	Frequency
 */
const asrLanguages = [
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


export {
	/**
	 * ASR languages:
	 * list of arrays, where an array in the list contains
	 * <pre>
	 * [0] Language, [1]	6 char *, [2]	Frequency
	 * </pre>
	 * @type Array<Array<string>>
	 */
	asrLanguages,
    /**
     * TTS languages & voices:
     * list of arrays, where an array in the list contains
     * <pre>
     * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
     * </pre>
     * @type Array<Array<string>>
     */
	ttsLanguages
};
