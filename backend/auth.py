import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import Session

from db import Base, get_db

# DEMO ONLY: fake accounts with visible passwords. Not real security.
DEMO_USERS = {
    "clinician": {"password": "demo-clinician", "role": "clinician", "name": "Demo Clinician"},
    "viewer": {"password": "demo-viewer", "role": "viewer", "name": "Demo Viewer"},
}

SESSIONS: dict = {}


class StatusChange(Base):
    """Audit trail: who changed which case status, and when."""
    __tablename__ = "status_changes"
    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, index=True)
    from_status = Column(String)
    to_status = Column(String)
    changed_by = Column(String)
    changed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class LoginBody(BaseModel):
    username: str
    password: str


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Sign in required.")
    user = SESSIONS.get(authorization[7:])
    if user is None:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    return user


def require_clinician(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "clinician":
        raise HTTPException(
            status_code=403,
            detail="Your demo role is read-only. Only the demo clinician can change statuses.",
        )
    return user


router = APIRouter()


@router.post("/auth/login")
def login(body: LoginBody):
    account = DEMO_USERS.get(body.username)
    ok = account is not None and secrets.compare_digest(
        account["password"].encode(), body.password.encode()
    )
    if not ok:
        raise HTTPException(status_code=401, detail="Incorrect username or password.")
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = {
        "username": body.username,
        "role": account["role"],
        "name": account["name"],
    }
    return {
        "token": token,
        "username": body.username,
        "role": account["role"],
        "name": account["name"],
        "notice": "Demo account. Not real authentication.",
    }


@router.get("/auth/me")
def me(user: dict = Depends(get_current_user)):
    return user


@router.get("/cases/{case_id}/history")
def case_history(
    case_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    rows = (
        db.query(StatusChange)
        .filter(StatusChange.case_id == case_id)
        .order_by(StatusChange.id)
        .all()
    )
    return [
        {
            "from_status": r.from_status,
            "to_status": r.to_status,
            "changed_by": r.changed_by,
            "changed_at": r.changed_at.isoformat() if r.changed_at else None,
        }
        for r in rows
    ]
