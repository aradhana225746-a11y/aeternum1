# App Flow Diagram

```mermaid
graph LR
    subgraph Pages["App Flow"]
        A["🏠 Landing Page"] -->|"Start Assessment"| B["📝 Assessment"]
        A -->|"Symptom Checker"| F["🔍 Symptom Checker"]
        A -->|"Period Tracker"| G["📅 Period Tracker"]
        B -->|"Step 1"| B1["Basic Profile\n Age, BMI, Sleep, Diet"]
        B1 -->|"Step 2"| B2["Mode Selection\n Period / Anemia / Cancer"]
        B2 -->|"Step 3"| B3["Mode Questions\n Detailed Health Qs"]
        B3 -->|"Step 4"| B4["Review and Submit"]
        B4 -->|"Analyze"| C["📊 Results Page"]
        C --> C1["Risk Level Badge"]
        C --> C2["Health Report"]
        C --> C3["Daily Glow-Up Plan"]
        C --> C4["Cancer Self-Exam\n if cancer mode"]
        F --> F1["Select Symptoms"]
        F1 --> F2["Get Analysis"]
        G --> G1["Log Periods"]
        G1 --> G2["View Predictions"]
    end
```

## Screen Navigation

| Screen | Route | Description |
|--------|-------|-------------|
| Landing Page | `/` | Hero, features, navigation to all tools |
| Assessment | `/assess` | 4-step health questionnaire |
| Results | `/results` | Risk report + personalized daily plan |
| Symptom Checker | `/symptoms` | Interactive symptom selection + analysis |
| Period Tracker | `/tracker` | Calendar-based period logging + predictions |

## Assessment Flow (4 Steps)

1. **Basic Profile** — Age, height, weight, BMI (auto-calculated), sleep, stress, activity, diet, water intake
2. **Mode Selection** — Choose focus: Period & Hormones, Anemia & Nutrition, or Cancer Awareness
3. **Mode Questions** — Detailed questions specific to the chosen mode (15-20 questions)
4. **Review & Submit** — Review all answers, then submit for analysis
