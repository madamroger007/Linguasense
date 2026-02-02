#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BASH_VERSION:-}" ]; then
  echo "❌ Please run this script with bash"
  exit 1
fi

ORIGINAL_USER="${SUDO_USER:-$USER}"
ORIGINAL_HOME="$(eval echo "~$ORIGINAL_USER")"

echo "========================================"
echo "  Linux + AMD GPU (ROCm) Installer"
echo "========================================"

# -------------------------------------------------
# CONFIG
# -------------------------------------------------
WHISPER_REPO="https://github.com/ggml-org/whisper.cpp"

PIPER_TAG="2023.11.14-2"
PIPER_BASE="https://github.com/rhasspy/piper/releases/download/${PIPER_TAG}"
PIPER_ARCHIVE="piper_linux_x86_64.tar.gz"

PIPER_HF_ZIP="https://huggingface.co/madamsjr/piper-voices/resolve/main/resource.zip?download=true"

MODEL_NAME="ggml-large-v3-turbo.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${ROOT_DIR}/_build_external_lib"
RESOURCE_DIR="${ROOT_DIR}/resources"

WHISPER_DIR="${BUILD_DIR}/whisper"
PIPER_DIR="${RESOURCE_DIR}/piper"

# -------------------------------------------------
# DEPENDENCIES
# -------------------------------------------------
echo "[1/8] Checking system dependencies..."
sudo apt update
sudo apt install -y git curl unzip cmake build-essential

# -------------------------------------------------
# CHECK ROCm
# -------------------------------------------------
echo "[2/8] Checking ROCm..."

if [ -d "/opt/rocm" ]; then
  ROCM_ROOT="/opt/rocm"
else
  ROCM_ROOT="$(ls -d /opt/rocm-* 2>/dev/null | sort -V | tail -n 1 || true)"
fi

if [ -z "${ROCM_ROOT}" ]; then
  echo "❌ ROCm not found. Install ROCm first."
  exit 1
fi

ROCM_LLVM_BIN="${ROCM_ROOT}/lib/llvm/bin"

if [ ! -x "${ROCM_LLVM_BIN}/clang" ]; then
  echo "❌ ROCm clang not found in ${ROCM_LLVM_BIN}"
  exit 1
fi

export CC="${ROCM_LLVM_BIN}/clang"
export CXX="${ROCM_LLVM_BIN}/clang++"

echo "✔ ROCm clang detected"

# -------------------------------------------------
# PREPARE FOLDERS
# -------------------------------------------------
echo "[3/8] Preparing folders..."
mkdir -p "${BUILD_DIR}"
mkdir -p "${RESOURCE_DIR}/whisper/models"
mkdir -p "${PIPER_DIR}"

# -------------------------------------------------
# BUILD WHISPER (ROCm)
# -------------------------------------------------
echo "[4/8] Building Whisper (ROCm)..."

cd "${BUILD_DIR}"

if [ ! -d whisper ]; then
  git clone "${WHISPER_REPO}" whisper
fi

cd whisper

cmake -B build \
  -DWHISPER_HIPBLAS=ON \
  -DCMAKE_CXX_FLAGS="--offload-arch=gfx1200"

cmake --build build -j$(nproc)

cp -r build/bin "${RESOURCE_DIR}/whisper/"

# -------------------------------------------------
# DOWNLOAD WHISPER MODEL
# -------------------------------------------------
echo "[5/8] Downloading Whisper model..."

MODEL_PATH="${RESOURCE_DIR}/whisper/models/${MODEL_NAME}"

if [ ! -f "${MODEL_PATH}" ]; then
  curl -L "${MODEL_URL}" -o "${MODEL_PATH}"
else
  echo "✔ Whisper model already exists"
fi

# -------------------------------------------------
# DOWNLOAD PIPER
# -------------------------------------------------
echo "[6/8] Downloading Piper..."

cd "${RESOURCE_DIR}"


if [ ! -f "${PIPER_ARCHIVE}" ]; then
  curl -L "${PIPER_BASE}/${PIPER_ARCHIVE}" -o "${PIPER_ARCHIVE}"
fi

tar -xzf "${PIPER_ARCHIVE}"
rm -f "${PIPER_ARCHIVE}"

# -------------------------------------------------
# DOWNLOAD PIPER RESOURCES (HF)
# -------------------------------------------------
echo "[7/8] Downloading Piper resources..."

curl -L "${PIPER_HF_ZIP}" -o resources.zip
unzip -o resources.zip -d "${PIPER_DIR}"
rm -f resources.zip

echo "========================================"
echo "  Build App (pnpm)"
echo "========================================"

echo "👤 Building as user: $ORIGINAL_USER"

sudo -u "$ORIGINAL_USER" bash <<EOF
set -e

export HOME="$ORIGINAL_HOME"
export NVM_DIR="\$HOME/.nvm"

# Load nvm (bash compatible)
if [ -s "\$NVM_DIR/nvm.sh" ]; then
  . "\$NVM_DIR/nvm.sh"
else
  echo "❌ nvm not found in \$NVM_DIR"
  exit 1
fi

cd "$ROOT_DIR"

echo "✔ node: \$(node -v)"
echo "✔ npm: \$(npm -v)"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

echo "✔ pnpm: \$(pnpm -v)"

pnpm install
pnpm run build:linux
EOF

# -------------------------------------------------
# DONE
# -------------------------------------------------
echo "[8/8] DONE 🎉"
echo "All resources installed successfully."
