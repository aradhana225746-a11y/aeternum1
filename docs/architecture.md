# Architecture Diagram

```mermaid
graph TB
    subgraph Client["🌐 Client - Browser"]
        direction TB
        A["React 18 + Vite"] --> B["React Router"]
        B --> C["Landing Page"]
        B --> D["Assessment Page"]
        B --> E["Results Page"]
        B --> F["Symptom Checker"]
        B --> G["Period Tracker"]
    end

    subgraph UI["🎨 UI Layer"]
        H["Tailwind CSS"] --> I["Framer Motion"]
        I --> J["Custom Components"]
        J --> J1["GlowCard"]
        J --> J2["ProgressBar"]
        J --> J3["TranslateButton"]
        J --> J4["ReadAloudButton"]
        J --> J5["VoiceAssistant"]
        J --> J6["BreastSelfExam SVG"]
        J --> J7["CervicalHealth"]
    end

    subgraph Logic["⚙️ Business Logic"]
        K["TranslationContext\n8 Languages"] --> L["analyzeResponses.js\nWHO-based Analysis"]
        L --> M["Risk Assessment"]
        L --> N["Daily Plan Generator"]
    end

    subgraph TTS["🔊 Text-to-Speech"]
        O["Sarvam AI API\nbulbul:v2"] --> P["Hindi, Tamil, Telugu\nBengali, Marathi"]
        Q["Web Speech API"] --> R["English, Spanish, French"]
    end

    Client --> UI
    Client --> Logic
    J4 --> TTS
    J5 --> TTS
    K --> J3
```

## Overview

Aeternum is a fully client-side React SPA. There is no backend server — all analysis runs in the browser using `analyzeResponses.js`. The only external API call is to **Sarvam AI** for regional language text-to-speech.

### Layers

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Routing** | React Router v6 | SPA navigation between 5 pages |
| **UI** | Tailwind CSS + Framer Motion | Styling, animations, transitions |
| **State** | React Context | Translation state (language selection) |
| **Analysis** | analyzeResponses.js | WHO-inspired risk scoring + plan generation |
| **TTS** | Sarvam AI + Web Speech API | Multilingual read-aloud for accessibility |
