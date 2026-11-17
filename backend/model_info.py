import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter()
FOLDER = Path(__file__).resolve().parent / "model_metadata"


def read(name):
    path = FOLDER / f"{name}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


@router.get("/models/metadata")
def model_metadata():
    return {"adult": read("adult"), "adolescent": read("adolescent")}
