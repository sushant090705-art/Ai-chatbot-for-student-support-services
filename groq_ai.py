import os
from dotenv import load_dotenv
from groq import Groq

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Pehla model fail ho to agla try hoga
MODELS = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
]

SYSTEM_PROMPT = (
    "You are a friendly and polite AI assistant for college students. "
    "Help with academics, exams, fees, attendance, library, hostel and "
    "placements. Keep answers short, clear and respectful. If you are not "
    "sure about a college-specific detail, say so and suggest contacting "
    "the college office."
)


def ask_ai(prompt):
    last_error = None

    for model in MODELS:
        try:
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            )
            return completion.choices[0].message.content

        except Exception as e:
            print(f"Groq Error ({model}):", repr(e))
            last_error = e

    print("All models failed. Last error:", repr(last_error))
    return "Sorry, I'm unable to connect to the AI service right now."