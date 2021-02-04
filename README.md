# [mmir-plugin-speech-nuance-lang][1]

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/mmig/mmir-plugin-speech-nuance-lang/master)](https://github.com/mmig/mmir-plugin-speech-nuance-lang)
[![npm](https://img.shields.io/npm/v/mmir-plugin-speech-nuance-lang)](https://www.npmjs.com/package/mmir-plugin-speech-nuance-lang)
[![API](https://img.shields.io/badge/docs-API%20reference-orange.svg?style=flat)](https://mmig.github.io/mmir/api)
[![Guides](https://img.shields.io/badge/docs-guides-orange.svg?style=flat)](https://github.com/mmig/mmir/wiki)

tools for querying supported languages (ASR and TTS) and voices (TTS) by Nuance / [Cerence][3] Speech API

_(internally uses [mmir-plugin-lang-support][2])_

## Intialization

In `cordova` module plugin code:
```javascript
// use corodva's require with exported main module ID:
var langTools = require('mmir-plugin-speech-nuance-lang.languageSupport');

// or global export:
var langTools = window.cordova.plugins.nuanceLanguageSupport.languageSupport;

...
```

As `AMD` module:
```javascript
// use async require (or specify as define-dependency):
require('mmir-plugin-speech-nuance-lang/dist/languageSupport', function(langToolsModule){
  var langTools = langToolsModule.languageSupport;

  ...
});
```

As `CommonJS` module:
```javascript

// use synchronous require:
var langTools = require('mmir-plugin-speech-nuance-lang').languageSupport;

// or "deep link":
var langTools = require('mmir-plugin-speech-nuance-lang/www/languageSupport');

...
```

## API

Exported functions for querying supported ASR and TTS languages and voices.

```typescript

/** get list of supported TTS language codes */
langTools.ttsLanguages(): string[];
/** get list of supported TTS voice details (filtered by language code / gender) */
langTools.ttsVoices(langCode?: string, gender?: Gender): LabeledVoiceDetails[];
/** get list of supported TTS voice names (filtered by language code / gender) */
langTools.ttsVoiceNames(langCode?: string, gender?: Gender): string[];
/** get best matching voice result (for language / gender: may return different gender and/or country code, if no matching voice is available) */
langTools.ttsBestVoiceFor(langCode: string, gender?: Gender): VoiceResult;
/** get list of supported ASR language codes */
langTools.asrLanguages(): string [];
/** get best matching voice (for language / gender: may return different gender and/or country code, if no matching voice is available) */
langTools.ttsSelectVoice(langCode: string, query?: Gender | string): LabeledVoiceDetails;

interface VoiceResult {
  voice: LabeledVoiceDetails;
  language: string;
  filter: string;
}

interface LabeledVoiceDetails {
  /** the name of the voice */
  name: string;
  /** a (human readable) label for the voice (if not available, returns same value as the name) */
  label: string;
  /** the language (code) of the voice */
  language: string;
  /** the gender of the voice */
  gender: "female" | "male" | "unknown";
  /** if voice is locally available or requires network/internet access */
  local: boolean | undefined;
}
```

## Integration Notes

for usage in cordova-plugins, copy `/dist` (AMD), `/www` (CommonJS), or `/src` (TypeScript)
to the appropriate location in plugin project, e.g. via the exported function
```javascript
const installFiles = require('mmir-plugin-speech-nuance-lang/install');

installFiles(srcDirType: "dist" | "src" | "www", targetDir: string, callback(err: Error | null))
```

[1]: https://github.com/mmig/mmir-plugin-speech-nuance-lang
[2]: https://github.com/mmig/mmir-plugin-lang-support
[3]: https://developer.cerence.com
