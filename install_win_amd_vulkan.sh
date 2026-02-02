#!/usr/bin/env bash
set -e

echo "========================================"
echo "  Windows + AMD GPU (VULKAN)"
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

PIPER_HF_ZIP="https://huggingface.co/madamsjr/piper-voices/resolve/main/resource.zip?download=true"


ROOT_DIR="$(pwd)"
BUILD_DIR="${ROOT_DIR}/_build_external_lib"
TARGET_DIR="${ROOT_DIR}/resources"

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
# FORCE VULKAN SDK (GIT BASH FIX)
# -------------------------------------------------
echo "[2/6] Setting Vulkan SDK..."

export VULKAN_SDK="/c/VulkanSDK/1.3.296.0"   # ⬅️ SESUAIKAN
export PATH="$VULKAN_SDK/Bin:$PATH"
export VK_LAYER_PATH="$VULKAN_SDK/Bin"

if ! command -v glslc >/dev/null; then
  echo "❌ glslc not found"
  echo "👉 Install Vulkan SDK and restart Git Bash"
  exit 1
fi

echo "✔ Vulkan SDK detected:"
glslc --version

# -------------------------------------------------
# PREPARE FOLDERS
# -------------------------------------------------
echo "[3/6] Preparing folders..."

mkdir -p "${BUILD_DIR}"
mkdir -p "${TARGET_DIR}/whisper/models"

# -------------------------------------------------
# BUILD WHISPER (VULKAN)
# -------------------------------------------------
echo "[4/6] Building Whisper (Vulkan)..."

cd "${BUILD_DIR}"

if [ ! -d whisper ]; then
  git clone https://github.com/ggml-org/whisper.cpp whisper
fi

cd whisper
rm -rf build
mkdir build

# ---- FORCE Vulkan SDK paths (WINDOWS FIX) ----
export VULKAN_SDK="/c/VulkanSDK/1.4.335.0"   # sesuaikan
export Vulkan_ROOT="$VULKAN_SDK"
export PATH="$VULKAN_SDK/Bin:$PATH"

cmake -S . -B build \
  -G "Visual Studio 17 2022" \
  -A x64 \
  -DGGML_VULKAN=ON \
  -DGGML_HIP=OFF \
  -DGGML_CUDA=OFF \
  -DGGML_METAL=OFF \
  -DVulkan_ROOT="$VULKAN_SDK" \
  -DVulkan_INCLUDE_DIR="$VULKAN_SDK/Include" \
  -DVulkan_LIBRARY="$VULKAN_SDK/Lib/vulkan-1.lib" \
  -DCMAKE_BUILD_TYPE=Release

cmake --build build --config Release

# copy binaries
mkdir -p "${TARGET_DIR}/whisper/bin32"
cp build/bin/Release/whisper*.exe "${TARGET_DIR}/whisper/"

# -------------------------------------------------
# DOWNLOAD WHISPER MODEL
# -------------------------------------------------
echo "[5/6] Downloading Whisper model..."

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

unzip -o "${PIPER_ZIP}"
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
echo "   │   ├─ whisper-cli.exe"
echo "   │   └─ models/${MODEL_NAME}"
echo "   └─ piper/"

pnpm install
pnpm build:windows
