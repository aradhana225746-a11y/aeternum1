from google import genai
import os

# Put your API key directly here TEMPORARILY for hackathon demo
# (But regenerate the key later)
client = genai.Client(api_key="AIzaSyBwDid-y53pIS8OIRwhP1xCAE-Cd6S_7yA")

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