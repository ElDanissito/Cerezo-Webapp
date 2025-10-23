from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Optional

DATA_DIR = Path(__file__).resolve().parent / "data"
USERS_FILE = DATA_DIR / "users.json"


def _ensure_store() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not USERS_FILE.exists():
        USERS_FILE.write_text("[]", encoding="utf-8")


def load_users() -> list[Dict[str, str]]:
    _ensure_store()
    with USERS_FILE.open("r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []
    if not isinstance(data, list):
        # Corrupt file; reset to empty list to avoid crashes in dev
        data = []
    return data


def save_users(users: list[Dict[str, str]]) -> None:
    _ensure_store()
    with USERS_FILE.open("w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)


def find_user(username: str) -> Optional[Dict[str, str]]:
    username_norm = username.strip().lower()
    for u in load_users():
        if u.get("usuario", "").strip().lower() == username_norm:
            return u
    return None
