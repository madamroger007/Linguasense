#!/usr/bin/env bash
set -e

echo "========================================"
echo "  Windows + NVIDIA GPU (CUDA)"
echo "========================================"

# -------------------------------------------------
# CONFIG
# -------------------------------------------------
WHISPER_REPO="https://github.com/ggml-org/whisper.cpp"

MODEL_NAME="ggml-large-v3-turbo.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}"

PIPER_TAG="2023.11.14-2"
PIPER_ZIP="piper_windows_amd64.zip"
PIPER_URL="https://github.com/rhasspy/piper/releases/download/${PIPER_TAG}/${PIPER_ZIP}"

ROOT_DIR="$(pwd)"
BUILD_DIR="${ROOT_DIR}/_build_external_lib"
RESOURCE_DIR="${ROOT_DIR}/resources"

WHISPER_DIR="${BUILD_DIR}/whisper"
CUDA_ARCH="native"   # bisa: native / 86 / 89 / 90

# -------------------------------------------------
# CHECK TOOLS
# -------------------------------------------------
echo "[1/6] Checking required tools..."

command -v cmake >/dev/null || { echo "❌ cmake not found"; exit 1; }
command -v git   >/dev/null || { echo "❌ git not found"; exit 1; }
command -v curl  >/dev/null || { echo "❌ curl not found"; exit 1; }
command -v unzip >/dev/null || { echo "❌ unzip not found"; exit 1; }

# -------------------------------------------------
# CHECK CUDA
# -------------------------------------------------
echo "[2/6] Checking CUDA..."

if ! command -v nvcc >/dev/null; then
  echo "❌ nvcc not found"
  echo "👉 Install CUDA Toolkit and ensure nvcc is in PATH"
  exit 1
fi

echo "✔ CUDA: $(nvcc --version | grep release)"

# -------------------------------------------------
# PREPARE FOLDERS
# -------------------------------------------------
echo "[3/6] Preparing folders..."

mkdir -p "${BUILD_DIR}"
mkdir -p "${RESOURCE_DIR}/ffmpeg"
mkdir -p "${RESOURCE_DIR}/whisper/models"
mkdir -p "${RESOURCE_DIR}/piper"

# -------------------------------------------------
# BUILD WHISPER (CUDA)
# -------------------------------------------------
echo "[4/6] Building Whisper (CUDA)..."

cd "${BUILD_DIR}"

if [ ! -d whisper ]; then
  git clone "${WHISPER_REPO}" whisper
fi

cd whisper

cmake -B build \
  -DGGML_CUDA=ON \
  -DCMAKE_CUDA_ARCHITECTURES="${CUDA_ARCH}"

cmake --build build --config Release

# copy executable
find build -name "whisper*.exe" -exec cp {} "${RESOURCE_DIR}/whisper/" \;

# -------------------------------------------------
# DOWNLOAD WHISPER MODEL
# -------------------------------------------------
echo "[5/6] Downloading Whisper model..."

MODEL_PATH="${RESOURCE_DIR}/whisper/models/${MODEL_NAME}"

if [ ! -f "${MODEL_PATH}" ]; then
  curl -L "${MODEL_URL}" -o "${MODEL_PATH}"
else
  echo "✔ Whisper model already exists"
fi

# -------------------------------------------------
# DOWNLOAD PIPER (WINDOWS)
# -------------------------------------------------
echo "[6/6] Downloading Piper (Windows)..."

cd "${RESOURCE_DIR}"

if [ ! -f "${PIPER_ZIP}" ]; then
  curl -LO "${PIPER_URL}"
fi

unzip -o "${PIPER_ZIP}"
rm -f "${PIPER_ZIP}"

# -------------------------------------------------
# DONE
# -------------------------------------------------
echo "========================================"
echo "✅ DONE"
echo
echo "Resources layout:"
echo "  resources/"
echo "   ├─ ffmpeg/"
echo "   ├─ whisper/"
echo "   │   ├─ whisper.exe"
echo "   │   └─ models/${MODEL_NAME}"
echo "   └─ piper/"
