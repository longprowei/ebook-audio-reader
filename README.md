# Ebook Audio Reader

Ebook Audio Reader is a personal iOS app for listening to ebook content from TXT and EPUB files.

The goal is to import a book, convert its text into audio with configurable AI text-to-speech providers, cache the generated audio locally, and play it like an audiobook.

Planned language support starts with Chinese and English.

## Current Status

The app currently has the basic Expo/React Native shell:

- Library screen
- Player screen
- Settings screen
- TTS provider settings for OpenAI, Google, and ElevenLabs
- Local settings storage with Expo SecureStore

TXT import, EPUB import, TTS generation, and real audio playback are still planned.

## Development

Requirements:

```txt
Node 20.19.4+
Expo Go for iPhone testing
```

Run locally:

```bash
npm install
npm run start -- --lan
```

Check TypeScript:

```bash
npm run typecheck
```
