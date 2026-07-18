from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import json
import sqlite3
from groq_ai import ask_ai

app = Flask(__name__)
app.secret_key = "student_support_secret_key"

# Load Knowledge Base
with open("data/knowledge.json", "r") as file:
    knowledge = json.load(file)


# ---------------- HOME (Landing Page) ----------------

@app.route("/")
def index():
    return render_template("index.html")


# ---------------- LOGIN ----------------

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("students.db")
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

        conn = sqlite3.connect("students.db")
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO students(name,email,password,branch,year)
            VALUES(?,?,?,?,?)
            """,
            (name, email, password, branch, year)
        )

        conn.commit()
        conn.close()

        return redirect(url_for("login"))

    return render_template("register.html")


# ---------------- STUDENT HOME ----------------

@app.route("/home")
def home():

    if "student_name" not in session:
        return redirect(url_for("login"))

    return render_template(
        "home.html",
        name=session["student_name"]
    )


# ---------------- CHATBOT ----------------

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


# ---------------- CHAT API ----------------

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

    # Ask AI if not found
    if reply is None:

        conversation = ""

        for item in history:

            conversation += f"User: {item['user']}\n"
            conversation += f"Assistant: {item['bot']}\n"

        conversation += f"User: {message}"

        reply = ask_ai(conversation)

    history.append({
        "user": message,
        "bot": reply
    })

    session["chat_history"] = history[-10:]
    session.modified = True

    return jsonify({
        "reply": reply
    })


# ---------------- NEW CHAT ----------------

@app.route("/new_chat")
def new_chat():

    session.pop("chat_history", None)

    return jsonify({
        "status": "success"
    })


# ---------------- LOGOUT ----------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


# ---------------- RUN ----------------

if __name__ == "__main__":
    app.run(debug=True)