#!/usr/bin/env bash
set -e

echo "========================================"
echo "  Windows + AMD GPU (ROCm / HIP)"
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

WHISPER_DIR="${BUILD_DIR}/whisper"
ROCM_HINT="/opt/rocm"

# -------------------------------------------------
# CHECK TOOLS
# -------------------------------------------------
echo "[1/6] Checking tools..."

command -v cmake >/dev/null || { echo "❌ cmake not found"; exit 1; }
command -v git   >/dev/null || { echo "❌ git not found"; exit 1; }
command -v curl  >/dev/null || { echo "❌ curl not found"; exit 1; }
command -v unzip >/dev/null || { echo "❌ unzip not found"; exit 1; }

# -------------------------------------------------
# CHECK HIP / ROCm CLANG
# -------------------------------------------------
echo "[2/6] Checking ROCm / HIP compiler..."

if command -v clang >/dev/null; then
  HIP_CLANG="$(command -v clang)"
elif [ -x "${ROCM_HINT}/bin/clang.exe" ]; then
  HIP_CLANG="${ROCM_HINT}/bin/clang.exe"
else
  echo "❌ HIP clang not found"
  echo "👉 Install AMD HIP SDK / ROCm Windows Preview"
  exit 1
fi

echo "✔ HIP clang: $HIP_CLANG"

# -------------------------------------------------
# PREPARE FOLDERS
# -------------------------------------------------
echo "[3/6] Preparing folders..."

mkdir -p "${BUILD_DIR}"
mkdir -p "${TARGET_DIR}/ffmpeg"
mkdir -p "${TARGET_DIR}/whisper/models"
mkdir -p "${TARGET_DIR}/piper"

# -------------------------------------------------
# BUILD WHISPER (HIP / ROCm)
# -------------------------------------------------
echo "[4/6] Building Whisper (HIP)..."

cd "${BUILD_DIR}"

if [ ! -d whisper ]; then
  git clone "${WHISPER_REPO}" whisper
fi

cd whisper

cmake -B build \
  -DWHISPER_HIPBLAS=ON \
  -DCMAKE_C_COMPILER="${HIP_CLANG}" \
  -DCMAKE_CXX_COMPILER="${HIP_CLANG}" \
  -DCMAKE_CXX_FLAGS="--offload-arch=gfx1200"

cmake --build build --config Release

# copy result
find build -name "whisper*.exe" -exec cp {} "${TARGET_DIR}/whisper/" \;

# -------------------------------------------------
# DOWNLOAD WHISPER MODEL
# -------------------------------------------------
echo "[5/6] Downloading Whisper model..."

MODEL_PATH="${TARGET_DIR}/whisper/models/${MODEL_NAME}"

if [ ! -f "${MODEL_PATH}" ]; then
  curl -L "${MODEL_URL}" -o "${MODEL_PATH}"
else
  echo "✔ Whisper model already exists"
fi

# -------------------------------------------------
# DOWNLOAD PIPER (WINDOWS)
# -------------------------------------------------
echo "[6/6] Downloading Piper (Windows)..."

cd "${TARGET_DIR}"

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
