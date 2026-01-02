# 🌐 LinguaSense

**LinguaSense** is a cross-platform **desktop application for learning English with the help of local AI models**, built using **Electron, React, and Vite**.

The application integrates **local Large Language Models (LLMs)** such as **Ollama** and **LM Studio**, allowing users to practice English **offline**, securely, and without sending data to cloud-based AI services.

---

## 🎯 Project Goals

- Provide an **offline-first English learning experience**
- Use **local AI models** for privacy and low latency
- Offer structured English practice: **Speaking, Reading, Writing**
- Serve as a **production-ready portfolio project** showcasing Electron + AI integration

---

## ✨ Core Features

### 🗣 Speaking Practice
- Text-based speaking simulation
- AI feedback on grammar and sentence structure
- Natural English rephrasing
- Suggestions for more native-like expressions

### 📖 Reading Practice
- Reading passages with adjustable difficulty
- Vocabulary explanations powered by AI
- Contextual Q&A about the text
- Comprehension assistance

### ✍️ Writing Practice
- Grammar and spelling correction
- Sentence refinement
- Tone adjustment (formal / casual)
- Explanation of mistakes for learning purposes

### ⚙️ AI Configuration
- Choose AI engine:
  - Ollama
  - LM Studio (OpenAI-compatible local API)
- Select local model
- Adjust temperature & response length
- No API keys required

---

## 🛠 Technology Stack

- **Electron** – Desktop application framework
- **React 18** – Frontend UI
- **Vite** – Fast development & build tool
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **React Router** – Page routing
- **Ollama / LM Studio** – Local AI inference

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- pnpm or npm
- Ollama or LM Studio installed locally

---

### Development Mode

Using **pnpm**:
```bash
pnpm install
or
npm install
```
LinguaSense uses Electron IPC to safely communicate between the UI and local AI engines.




