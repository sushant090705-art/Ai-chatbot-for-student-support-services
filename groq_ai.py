from groq import Groq
import os
from dotenv import load_dotenv


client = Groq(
    api_key = os.environ.get("GROQ_API_KEY")
)

def ask_ai(prompt):

    try:

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[

                {
                    "role": "system",
                    "content": """
You are an AI Student Support Assistant.

Rules:
- Answer politely.
- Keep answers concise.
- Help students with admissions, fees, exams, academics, placements and college life.
- Use previous conversation context when answering follow-up questions.
"""
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ]

        )

        return completion.choices[0].message.content

    except Exception as e:

        print("Groq Error:", e)

        return "Sorry, I'm unable to connect to the AI service."
    