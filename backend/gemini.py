import os
import google.generativeai as genai

def init_gemini():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel("gemini-2.5-flash")

def ask_gemini(model, prompt):
    return model.generate_content(prompt).text
