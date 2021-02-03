/**
 * [0] Language, [1]	6 char *, [2]	Voice, [3]	M / F
 */
declare const ttsLanguages: string[][];
/**
 * [0] Language, [1]	6 char *, [2]	Frequency
 */
declare const asrLanguages: string[][];
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
ttsLanguages };
