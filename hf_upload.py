import os
from huggingface_hub import HfApi

os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

FOLDER = "/home/adam/Programming/resource"

if not os.path.isdir(FOLDER):
    raise RuntimeError(f"Folder not found: {FOLDER}")

api = HfApi()

api.upload_large_folder(
    repo_id="madamsjr/piper-voices",
    repo_type="model",
    folder_path=FOLDER,
)
