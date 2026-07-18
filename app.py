import os
import json
import sqlite3
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from dotenv import load_dotenv

# 1. Force load the .env file using its absolute path to prevent folder path mismatch issues
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# 2. Terminal diagnostic printout to verify visibility at startup
print("\n=== BACKEND SERVER DIAGNOSTIC ===")
debug_key = os.environ.get("GROQ_API_KEY")
if debug_key:
    print(f"STATUS: Success! Flask can read GROQ_API_KEY. Starts with: {debug_key[:5]}...")
else:
    print("STATUS: CRITICAL ERROR! Flask cannot see GROQ_API_KEY. Check your .env file location.")
print("=================================\n")

# 3. Now import your custom AI module safely
from groq_ai import ask_ai

app = Flask(__name__)
app.secret_key = "student_support_secret_key"

# Load Knowledge Base safely
KNOWLEDGE_FILE = os.path.join(BASE_DIR, "data", "knowledge.json")
try:
    with open(KNOWLEDGE_FILE, "r") as file:
        knowledge = json.load(file)
except FileNotFoundError:
    knowledge = {}


# Helper function to ensure database and table exist at launch
def init_db():
    conn = sqlite3.connect(os.path.join(BASE_DIR, "students.db"))
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            branch TEXT,
            year TEXT
        )
    """)
    conn.commit()
    conn.close()

# ---------------- HOME (Redirects to Register) ----------------

@app.route("/")
def index():
    return redirect(url_for("register"))


# ---------------- LOGIN ----------------

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect(os.path.join(BASE_DIR, "students.db"))
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM students WHERE email=? AND password=?",
            (email, password)
        )
        student = cursor.fetchone()
        conn.close()

        if student:
            session["student_name"] = student[1]
            session["student_email"] = student[2]
            return redirect(url_for("home"))

        return "Invalid Email or Password"

    return render_template("login.html")


# ---------------- REGISTER ----------------

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        branch = request.form["branch"]
        year = request.form["year"]

        try:
            conn = sqlite3.connect(os.path.join(BASE_DIR, "students.db"))
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO students(name, email, password, branch, year)
                VALUES(?,?,?,?,?)
                """,
                (name, email, password, branch, year)
            )
            conn.commit()
            conn.close()
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            return "Email already registered!"

    return render_template("register.html")


# ---------------- STUDENT HOME ----------------

@app.route("/home")
def home():
    if "student_name" not in session:
        return redirect(url_for("login"))

    return render_template("home.html", name=session["student_name"])


# ---------------- STUDENT PROFILE ----------------

@app.route("/profile")
def profile():
    if "student_name" not in session:
        return redirect(url_for("login"))

    conn = sqlite3.connect(os.path.join(BASE_DIR, "students.db"))
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name, email, branch, year FROM students WHERE email=?",
        (session["student_email"],)
    )
    student_info = cursor.fetchone()
    conn.close()

    if not student_info:
        return "User data not found.", 404

    return render_template(
        "profile.html",
        name=student_info[0],
        email=student_info[1],
        branch=student_info[2],
        year=student_info[3]
    )


# ---------------- CHATBOT UI ----------------

@app.route("/chatbot")
def chatbot():
    if "student_name" not in session:
        return redirect(url_for("login"))

    return render_template("chatbot.html")


# ---------------- FAQ ----------------

@app.route("/faq")
def faq():
    return render_template("faq.html")


# ---------------- CONTACT ----------------

@app.route("/contact")
def contact():
    return render_template("contact.html")


# ---------------- CHAT API ENGINE ----------------

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    if "chat_history" not in session:
        session["chat_history"] = []

    history = session["chat_history"]
    reply = None

    # Knowledge Base Search
    for key in knowledge:
        if key.lower() in message.lower():
            reply = knowledge[key]
            break

    # Ask AI if not explicitly found in knowledge base
    if reply is None:
        conversation = ""
        for item in history:
            conversation += f"User: {item['user']}\n"
            conversation += f"Assistant: {item['bot']}\n"
        
        conversation += f"User: {message}"
        reply = ask_ai(conversation)

    # Track conversation history
    history.append({
        "user": message,
        "bot": reply
    })

    session["chat_history"] = history[-10:]
    session.modified = True

    return jsonify({"reply": reply})


# ---------------- NEW CHAT CLEAR ----------------

@app.route("/new_chat")
def new_chat():
    session.pop("chat_history", None)
    return jsonify({"status": "success"})


# ---------------- LOGOUT ----------------

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":
    init_db()  # Setup tables automatically if missing
    app.run(debug=True)