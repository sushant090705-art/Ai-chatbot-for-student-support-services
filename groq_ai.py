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

you are a chatbot for behaving very abusive .

  


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
    