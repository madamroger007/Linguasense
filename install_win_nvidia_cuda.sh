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
TARGET_DIR="${ROOT_DIR}/resources"
PIPER_DIR="${TARGET_DIR}/piper"

# -------------------------------------------------
# CHECK TOOLS
# -------------------------------------------------
echo "[1/6] Checking tools..."

for tool in cmake git curl unzip; do
  command -v "$tool" >/dev/null || {
    echo "❌ $tool not found"
    exit 1
  }
done

# -------------------------------------------------
# CHECK CUDA
# -------------------------------------------------
echo "[2/6] Checking CUDA..."

if ! command -v nvcc >/dev/null 2>&1; then
  echo "❌ nvcc not found"
  echo "👉 Install CUDA Toolkit + restart terminal"
  exit 1
fi

echo "✔ CUDA detected:"
nvcc --version

# -------------------------------------------------
# PREPARE FOLDERS
# -------------------------------------------------
echo "[3/6] Preparing folders..."

mkdir -p "${BUILD_DIR}"
mkdir -p "${TARGET_DIR}/whisper/models"
mkdir -p "${PIPER_DIR}"

# -------------------------------------------------
# BUILD WHISPER (CUDA)
# -------------------------------------------------
echo "[4/6] Building Whisper (CUDA)..."

cd "${BUILD_DIR}"

if [ ! -d whisper ]; then
  git clone "${WHISPER_REPO}" whisper
fi

cd whisper
rm -rf build

cmake -S . -B build \
  -G "Visual Studio 17 2022" \
  -A x64 \
  -DGGML_CUDA=ON \
  -DGGML_HIP=OFF \
  -DGGML_VULKAN=OFF \
  -DGGML_METAL=OFF \
  -DCMAKE_BUILD_TYPE=Release

cmake --build build --config Release

# copy binaries
mkdir -p "${TARGET_DIR}/whisper"
cp build/bin/Release/whisper*.exe "${TARGET_DIR}/whisper/"

# -------------------------------------------------
# DOWNLOAD WHISPER MODEL
# -------------------------------------------------
echo "[5/6] Downloading Whisper model..."
# copy binaries
mkdir -p "${TARGET_DIR}/whisper/bin32"
cp build/bin/Release/whisper*.exe "${TARGET_DIR}/whisper/"

MODEL_PATH="${TARGET_DIR}/whisper/models/${MODEL_NAME}"

if [ ! -f "${MODEL_PATH}" ]; then
  curl -L "${MODEL_URL}" -o "${MODEL_PATH}"
else
  echo "✔ Model already exists"
fi

# -------------------------------------------------
# DOWNLOAD PIPER (WINDOWS)
# -------------------------------------------------
echo "[6/6] Downloading Piper..."

cd "${TARGET_DIR}"

if [ ! -f "${PIPER_ZIP}" ]; then
  curl -LO "${PIPER_URL}"
fi

unzip -o "${PIPER_ZIP}" -d "${PIPER_DIR}"
rm -f "${PIPER_ZIP}"

cd "${TARGET_DIR}/piper"
curl -L "${PIPER_HF_ZIP}" -o resources.zip
unzip -o resources.zip -d "${PIPER_DIR}"
rm -f resources.zip

echo "========================================"
echo "✅ DONE"
echo
echo "Resources layout:"
echo "  resources/"
echo "   ├─ whisper/"
echo "   │   ├─ whisper.exe"
echo "   │   └─ models/${MODEL_NAME}"
echo "   └─ piper/"
