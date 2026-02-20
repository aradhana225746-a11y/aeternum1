import google.generativeai as genai

# Replace with your NEW API key
genai.configure(api_key="AIzaSyBwDid-y53pIS8OIRwhP1xCAE-Cd6S_7yA")

model = genai.GenerativeModel("gemini-2.5-flash")

# Initialize chat with history - setting the bot's role/persona
initial_history = [
    {
        "role": "user",
        "parts": ["You are a knowledgeable and friendly doctor assistant. You provide helpful medical information, answer health-related questions, and offer general wellness advice. Always remind users to consult with a real healthcare professional for serious concerns."]
    },
    {
        "role": "model",
        "parts": ["I understand. I'm here to help as a doctor assistant. I'll provide helpful medical information and health advice while reminding users to consult healthcare professionals for serious concerns. How can I assist you today?"]
    }
]

chat = model.start_chat(history=initial_history)

print("Chatbot started! Type 'exit' to stop.")
print("(Doctor Assistant Mode - Ask me health-related questions)\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Chatbot ended.")
        break

    response = chat.send_message(user_input)
    print("Bot:", response.text)