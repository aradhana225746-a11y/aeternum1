import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key="AIzaSyC-F4ofwwn5PYGzwI92-meUWptFUTc4-3M")

model = "gemini-2.5-flash"

def generate_plan():
    prompt = """
User Profile:
Age: 19
Mode: Period & Hormones
Detected Pattern: PCOS Pattern
Key Symptoms: irregular cycles, acne, weight gain

Generate:
1. A cautious explanation (non-diagnostic).
2. A 1-day personalized lifestyle plan.
3. Include medical disclaimer.
Do not prescribe medication.
"""

    response = client.models.generate_content(
        model=model,
        contents=prompt
    )

    print("\n=== AI RESULT ===\n")
    print(response.text)

generate_plan()