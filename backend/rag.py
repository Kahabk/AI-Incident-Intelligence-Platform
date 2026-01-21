import faiss
import os
import pickle
from embeddings import embed_texts

VECTOR_PATH = "/vector_store/index.faiss"
META_PATH = "/vector_store/meta.pkl"

def build_index(chunks):
    vectors = embed_texts(chunks)
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)
    faiss.write_index(index, VECTOR_PATH)
    pickle.dump(chunks, open(META_PATH, "wb"))

def query_index(question, k=3):
    index = faiss.read_index(VECTOR_PATH)
    chunks = pickle.load(open(META_PATH, "rb"))
    q_vec = embed_texts([question])
    _, ids = index.search(q_vec, k)
    return [chunks[i] for i in ids[0]]
