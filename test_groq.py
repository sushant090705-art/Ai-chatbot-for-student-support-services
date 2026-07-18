import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

api_key = os.environ.get("GROQ_API_KEY")
print(f"--- Diagnostic Check ---")
print(f"API Key Found: {'Yes (Starts with ' + api_key[:5] + '...)' if api_key else 'NO - KEY IS EMPTY'}")

try:
    client = Groq(api_key=api_key)
    print("Initializing client... Success.")
    
    print("Sending test request to Llama model...")
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Hello! Respond with the word 'Working' if you hear me."}]
    )
    print(f"Response from Groq: {completion.choices[0].message.content}")
    
except Exception as e:
    print(f"\n[CRITICAL ERROR CRASHED]: {e}")