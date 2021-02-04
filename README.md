# mmir-plugin-speech-nuance-lang

tools for querying supported languages (ASR and TTS) and voices (TTS) by Nuance SpeechKit

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
require('mmir-plugin-speech-nuance-lang/dist/languageSupport', function(langTools){

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
```

## Integration Notes

for usage in cordova-plugins, copy `/dist` (AMD), `/www` (CommonJS), or `/src` (TypeScript)
to the appropriate location in plugin project, e.g. via the exported function
```javascript
const installFiles = require('mmir-plugin-speech-nuance-lang');

installFiles(srcDirType: "dist" | "src" | "www", targetDir: string, callback(err: Error | null))
```
