<p align="center" style="margin: 50px">
  <img src="build/icon.ico" alt="LinguaSense Logo" width="200"/>
</p>

# 🌐 LinguaSense

**LinguaSense** is a cross-platform **desktop application for learning English using local AI models**.
Built with **Electron, React, and Vite**, it focuses on **offline usage**, **privacy**, and **GPU-accelerated AI inference**.

---

## 🎯 Project Overview

- Offline-first English learning desktop app
- Local AI inference (no cloud, no API keys)
- GPU acceleration (AMD & NVIDIA)
- Portfolio-ready Electron + AI project

---

## ✨ Core Features

- **Speaking Practice** – Grammar feedback and natural rephrasing
- **Reading Practice** – AI-assisted comprehension & vocabulary
- **Writing Practice** – Corrections with explanations
- **Local AI Configuration** – Ollama / LM Studio support

---

## 📦 Build Output

- All compiled builds are located in the **`dist/` folder**
- Each platform build is packaged as a **ZIP archive**
- Simply **extract the ZIP** to run the application

---

## ⚠️ System Requirements

### General Tools
Required for development or advanced builds:

- **Node.js 18+**
- **pnpm**
- **CMake**
- **Visual Studio 2022**
  - Desktop Development with C++
- Updated **GPU drivers**

---

## 🚀 Installation Guide

### 🪟 Windows — AMD (Vulkan)

1. Install **AMD GPU Driver**
2. Install **Vulkan SDK**
3. (Optional) Install **ROCm** if supported
4. Install **CMake** and **Visual Studio C++ Desktop Tools**
5. Run the Windows installer from the release build
```
./install_win_amd_vulkan.sh
```
---

### 🪟 Windows — NVIDIA (CUDA)

1. Install **NVIDIA GPU Driver**
2. Install **CUDA Toolkit**
3. Install **Vulkan SDK**
4. Install **CMake** and **Visual Studio C++ Desktop Tools**
5. Run the Windows installer from the release build
```
./install_win_nvidia_cuda.sh
```
---

### 🐧 Linux — AMD (ROCm)

1. Install **ROCm** compatible with your distro
2. Install **Vulkan**
3. Ensure `cmake`, `gcc`, and `make` are available
4. Extract the Linux build ZIP
5. Run the executable
```
sudo sh ./install_linux_amd_rocm.sh
```
---

### 🐧 Linux — NVIDIA (CUDA)

1. Install **NVIDIA Driver**
2. Install **CUDA Toolkit**
3. Install **Vulkan**
4. Ensure build essentials are installed
5. Extract the Linux build ZIP and run
```
sudo sh ./install_linux_nvidia_cuda.sh
```
---

---

## 🧠 Local AI Engine (Offline)

LinguaSense runs **fully offline** using local AI engines.
No internet connection or API keys are required after setup.

### 🔹 Using LM Studio (Recommended)

**LM Studio** allows you to download and run LLMs **locally and offline**.

#### Steps

1. Download **LM Studio**
   👉 https://lmstudio.ai

2. Open LM Studio and **download a model**
   Recommended formats:
   - GGUF
   - Q4 / Q5 quantized models (better performance)

3. Enable **Local Server Mode**
   - Start the local inference server
   - Default endpoint:
     ```
     http://localhost:1234/v1
     ```

4. Select **LM Studio** as the AI engine inside LinguaSense
5. Choose the downloaded local model

✅ After the model is downloaded, **LinguaSense works 100% offline**

---

### 🔹 Model Recommendations

- Small / Medium GPUs:
  - `llama-3-8b`
  - `mistral-7b`
- Larger GPUs:
  - `llama-3-70b`
  - `mixtral`

> Choose quantized models for lower VRAM usage.

---

### 🔒 Privacy & Offline Mode

- All prompts and responses run **locally**
- No data is sent to external servers
- Suitable for private, secure, and offline environments

---


## 🛠 Technology Stack

- **Electron**
- **React 18**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Local LLMs (Ollama / LM Studio)**

---

## 📌 Notes

- GPU drivers **must match your hardware**
- Vulkan / CUDA / ROCm are required for optimal AI performance
- No internet connection is required after setup

---

## 📄 License

Apache License
