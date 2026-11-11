from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import require_clinician
from db import get_db
from models import Case

router = APIRouter()

CONSENT = ["not_recorded", "consented", "declined"]
LANGS = ["ar", "en"]
CHANNELS = ["sms", "email", "phone", "none"]


class ConsentUpdate(BaseModel):
    consent_status: str
    preferred_language: str
    preferred_channel: str


@router.patch("/cases/{case_id}/consent")
def update_consent(
    case_id: int,
    body: ConsentUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_clinician),
):
    if body.consent_status not in CONSENT:
        raise HTTPException(status_code=400, detail=f"Invalid consent status. Allowed: {CONSENT}")
    if body.preferred_language not in LANGS:
        raise HTTPException(status_code=400, detail=f"Invalid language. Allowed: {LANGS}")
    if body.preferred_channel not in CHANNELS:
        raise HTTPException(status_code=400, detail=f"Invalid channel. Allowed: {CHANNELS}")

    case = db.query(Case).filter(Case.id == case_id).first()
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")

    # Respect the right to decline: no contact channel unless consent is recorded.
    channel = body.preferred_channel if body.consent_status == "consented" else "none"

    case.consent_status = body.consent_status
    case.preferred_language = body.preferred_language
    case.preferred_channel = channel
    case.consent_updated_by = user["username"]
    case.consent_updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(case)
    return {c.name: getattr(case, c.name) for c in Case.__table__.columns}
