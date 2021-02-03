# mmir-plugin-speech-nuance-lang

tools for querying supported languages (ASR and TTS) and voices (TTS) by Nuance SpeechKit


NOTE: for usage in cordova-plugins, copy `/dist` (AMD), `/www` (CommonJS), or `/src` (TypeScript)
       to the appropriate location in plugin project, e.g. via the exported function
      ```javascript
      const installFiles = require('mmir-plugin-speech-nuance-lang');

      installFiles(srcDirType: "dist" | "src" | "www", targetDir: string, callback(err: Error | null))
      ```
