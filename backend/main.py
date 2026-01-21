from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from gemini import init_gemini, ask_gemini
from rag import build_index, query_index
import PyPDF2
import os

app = FastAPI()

# 🔥 CORS (MANDATORY FOR UI / BROWSER)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # in production: set specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = init_gemini()

DATA_DIR = "/data/pdfs"
VECTOR_PATH = "/vector_store/index.faiss"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs("/vector_store", exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
def upload_pdf(file: UploadFile):
    try:
        path = f"{DATA_DIR}/{file.filename}"
        with open(path, "wb") as f:
            f.write(file.file.read())

        reader = PyPDF2.PdfReader(path)

        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        if len(text.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="PDF has no readable text (probably scanned image PDF)"
            )

        # Chunking
        chunks = [text[i:i+500] for i in range(0, len(text), 500)]

        # Build FAISS index
        build_index(chunks)

        return {
            "status": "indexed",
            "filename": file.filename,
            "chunks": len(chunks)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask")
def ask(data: dict):
    try:
        if not os.path.exists(VECTOR_PATH):
            return {
                "error": "No documents indexed yet. Please upload PDFs first."
            }

        question = data.get("question")
        if not question:
            raise HTTPException(status_code=400, detail="Missing question")

        context = query_index(question)

        prompt = f"""
You are an AI Incident Intelligence assistant.

Use ONLY the following context to answer.
If the answer is not in the context, say you don't know.

Context:
{context}

Question:
{question}
"""

        answer = ask_gemini(model, prompt)

        return {
            "question": question,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
