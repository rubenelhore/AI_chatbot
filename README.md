# 🤖 AI Chatbot with RAG

> Intelligent document Q&A system using Retrieval-Augmented Generation

![AI Chatbot Demo](https://imgur.com/a/sBAAyJm)

## 🎯 What it does

Upload documents (PDFs, text files), ask questions in natural language, and get accurate answers with source citations powered by AI.

**Live Demo:** [Coming Soon] | **Video Demo:** [2-min Loom video - add link]

---

## ⚡ Key Features

- 📄 **Document Upload** - Support for PDF and text files
- 🔍 **Semantic Search** - Vector-based document retrieval using embeddings
- 💬 **Conversational AI** - Natural language Q&A powered by GPT
- 📌 **Source Citations** - Shows which document section answers came from
- 🎨 **Modern UI** - Clean interface built with React + TypeScript

---

## 🏗️ Architecture
```
PDF Upload → Text Extraction → Chunking → Embeddings (OpenAI)
                                              ↓
User Question → Embedding → Vector Search (Pinecone) → Top K chunks
                                              ↓
                            GPT-4 + Context → Answer with Citations
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)

**Backend:**
- FastAPI (Python)
- OpenAI API (embeddings + GPT-4)
- Pinecone (vector database)

**Deployment:**
- Frontend: Vercel
- Backend: Railway / Render

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key
- Pinecone API key

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/AI_chatbot.git
cd AI_chatbot

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY and PINECONE_API_KEY
```

### Run locally
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn main:app --reload
```

Open http://localhost:5173

---

## 📸 Screenshots

### Upload Interface
![Upload](https://via.placeholder.com/600x300?text=Upload+Screenshot)

### Chat Interface
![Chat](https://via.placeholder.com/600x300?text=Chat+Screenshot)

### Answer with Sources
![Answer](https://via.placeholder.com/600x300?text=Answer+Screenshot)

---

## 💡 How it works

1. **Document Processing**: PDFs are split into 500-token chunks with 50-token overlap
2. **Embedding Generation**: Each chunk is converted to a 1536-dimensional vector using OpenAI's `text-embedding-ada-002`
3. **Vector Storage**: Embeddings are stored in Pinecone for fast similarity search
4. **Query Processing**: User questions are embedded and matched against document chunks
5. **Answer Generation**: Top 3 relevant chunks are sent to GPT-4 as context to generate answers

---

## 🎓 What I Learned

- Implementing RAG (Retrieval-Augmented Generation) from scratch
- Optimizing chunking strategies for better context retrieval
- Managing vector databases with Pinecone
- Prompt engineering for accurate citations
- Building type-safe React apps with TypeScript

---

## 🚧 Roadmap

- [ ] Support for Word documents and Excel files
- [ ] Multi-language support (Spanish, French, etc.)
- [ ] Conversation history and follow-up questions
- [ ] Export answers to PDF
- [ ] Real-time streaming responses

---

## 📦 Project Structure
```
AI_chatbot/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   └── services/           # API clients
├── backend/                # FastAPI backend
│   ├── main.py             # API routes
│   ├── embeddings.py       # Embedding logic
│   └── vectorstore.py      # Pinecone operations
└── README.md
```

---

## 🤝 Contributing

This is a personal learning project, but feedback is welcome! Open an issue or reach out.

---

## 👨‍💻 Author

**Rubén Martínez Elhore**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio.com](https://yourportfolio.com)

---

## 📝 License

MIT License - feel free to use this for learning purposes

---

## 🙏 Acknowledgments

Built with:
- [OpenAI API](https://openai.com)
- [Pinecone](https://pinecone.io)
- [FastAPI](https://fastapi.tiangolo.com)
- [React](https://react.dev)

---

**⭐ If you found this project helpful, give it a star!**
