from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import inspect
from sqlalchemy.orm import Session

import models  # noqa: F401
from auth import StatusChange, require_clinician
from auth import router as auth_router
from consent import router as consent_router
from db import Base, engine, get_db
from model_adapter import (AdultFeatures, ModelNotConnected, PredictionResponse,
                           is_connected, model_mode, predict_adult)
from models import Case

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CarePath AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(consent_router)

ALLOWED_STATUSES = [
    "identified",
    "awaiting_engagement",
    "appointment_recommended",
    "appointment_scheduled",
    "visit_completed",
    "follow_up_required",
    "closed",
]


class StatusUpdate(BaseModel):
    status: str


def case_to_dict(case: Case) -> dict:
    return {c.name: getattr(case, c.name) for c in Case.__table__.columns}


@app.get("/health")
def health():
    return {"status": "ok", "project": "CarePath AI"}


@app.get("/health/db")
def health_db():
    return {"database": "connected", "tables": inspect(engine).get_table_names()}


@app.get("/model-status")
def model_status():
    connected = is_connected()
    return {
        "adult_model_connected": connected,
        "mode": model_mode(),
        "message": (
            "Model integration configured."
            if connected
            else "No adult model connected. Risk scores are not shown."
        ),
    }


@app.post("/predict/adult", response_model=PredictionResponse)
def predict_adult_endpoint(features: AdultFeatures):
    try:
        return predict_adult(features)
    except ModelNotConnected as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.post("/predict/child")
def predict_child_endpoint():
    raise HTTPException(
        status_code=501,
        detail=(
            "No child-specific predictive model exists. Adult models are never "
            "applied to children. Child flags use rule-based demonstration logic."
        ),
    )


@app.get("/cases")
def list_cases(db: Session = Depends(get_db)):
    cases = db.query(Case).order_by(Case.id).all()
    return {
        "notice": "All records are synthetic demo data, not real patients.",
        "count": len(cases),
        "cases": [case_to_dict(c) for c in cases],
    }


@app.patch("/cases/{case_id}/status")
def update_status(
    case_id: int,
    body: StatusUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_clinician),
):
    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {ALLOWED_STATUSES}",
        )
    case = db.query(Case).filter(Case.id == case_id).first()
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    old_status = case.status
    case.status = body.status
    db.add(
        StatusChange(
            case_id=case_id,
            from_status=old_status,
            to_status=body.status,
            changed_by=user["username"],
        )
    )
    db.commit()
    db.refresh(case)
    return case_to_dict(case)


