from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Float, Integer, String
from sqlalchemy.orm import Session

from auth import require_clinician
from db import Base, get_db


class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    publisher = Column(String)
    country = Column(String)
    coverage = Column(String)
    population_group = Column(String)
    collection_year = Column(String)
    data_format = Column(String)
    source_url = Column(String)
    licence = Column(String)
    record_count = Column(Integer)
    record_count_verified = Column(Boolean, default=False)
    missing_value_pct = Column(Float)
    added_by = Column(String)
    added_at = Column(String)


class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    version = Column(String)
    population_group = Column(String)
    model_type = Column(String)
    status = Column(String)
    evaluation_date = Column(String)
    notes = Column(String)
    added_by = Column(String)
    added_at = Column(String)


GROUPS = ["child", "adult", "both"]
MODEL_GROUPS = ["child", "adult"]
MODEL_TYPES = ["rule_based_demo", "ml_model"]
MODEL_STATUSES = ["not_connected", "demo_logic"]


def clean(v):
    v = (v or "").strip()
    return v or None


def as_dict(obj, cls):
    return {c.name: getattr(obj, c.name) for c in cls.__table__.columns}


class DatasetIn(BaseModel):
    name: str
    publisher: str
    country: str | None = None
    coverage: str | None = None
    population_group: str
    collection_year: str | None = None
    data_format: str | None = None
    source_url: str
    licence: str
    record_count: int | None = None
    record_count_verified: bool = False
    missing_value_pct: float | None = None


class ModelIn(BaseModel):
    name: str
    version: str | None = None
    population_group: str
    model_type: str
    status: str = "not_connected"
    evaluation_date: str | None = None
    notes: str | None = None


router = APIRouter()


@router.get("/registry/datasets")
def list_datasets(db: Session = Depends(get_db)):
    return [as_dict(d, Dataset) for d in db.query(Dataset).order_by(Dataset.id).all()]


@router.get("/registry/models")
def list_models(db: Session = Depends(get_db)):
    return [as_dict(m, ModelVersion) for m in db.query(ModelVersion).order_by(ModelVersion.id).all()]


@router.post("/registry/datasets")
def add_dataset(
    body: DatasetIn,
    db: Session = Depends(get_db),
    user: dict = Depends(require_clinician),
):
    name = body.name.strip()
    publisher = body.publisher.strip()
    licence = body.licence.strip()
    url = body.source_url.strip()
    if not name or not publisher or not licence:
        raise HTTPException(status_code=400, detail="Name, publisher and licence are required.")
    if not (url.startswith("http://") or url.startswith("https://")):
        raise HTTPException(status_code=400, detail="The source link must start with http:// or https://.")
    if body.population_group not in GROUPS:
        raise HTTPException(status_code=400, detail=f"Population group must be one of {GROUPS}.")
    if body.record_count is not None:
        if not body.record_count_verified:
            raise HTTPException(
                status_code=400,
                detail="A record count can only be entered once it has been verified.",
            )
        if body.record_count < 0:
            raise HTTPException(status_code=400, detail="The record count cannot be negative.")
    if body.missing_value_pct is not None and not (0 <= body.missing_value_pct <= 100):
        raise HTTPException(status_code=400, detail="Missing values must be between 0 and 100 percent.")

    d = Dataset(
        name=name,
        publisher=publisher,
        country=clean(body.country),
        coverage=clean(body.coverage),
        population_group=body.population_group,
        collection_year=clean(body.collection_year),
        data_format=clean(body.data_format),
        source_url=url,
        licence=licence,
        record_count=body.record_count,
        record_count_verified=body.record_count is not None,
        missing_value_pct=body.missing_value_pct,
        added_by=user["username"],
        added_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return as_dict(d, Dataset)


@router.post("/registry/models")
def add_model(
    body: ModelIn,
    db: Session = Depends(get_db),
    user: dict = Depends(require_clinician),
):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="A model name is required.")
    if body.population_group not in MODEL_GROUPS:
        raise HTTPException(status_code=400, detail=f"Population group must be one of {MODEL_GROUPS}.")
    if body.model_type not in MODEL_TYPES:
        raise HTTPException(status_code=400, detail=f"Model type must be one of {MODEL_TYPES}.")
    if body.status == "connected":
        raise HTTPException(
            status_code=400,
            detail="The registry only records information. Connecting a model needs the loader in model_adapter.py and ADULT_MODEL_MODE. Register it as not_connected for now.",
        )
    if body.status not in MODEL_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {MODEL_STATUSES}.")
    if body.status == "demo_logic" and body.model_type != "rule_based_demo":
        raise HTTPException(status_code=400, detail="Only rule-based demo logic can use the demo_logic status.")
    ev = clean(body.evaluation_date)
    if ev:
        try:
            datetime.strptime(ev, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="The evaluation date must look like 2026-11-30.")

    m = ModelVersion(
        name=body.name.strip(),
        version=clean(body.version),
        population_group=body.population_group,
        model_type=body.model_type,
        status=body.status,
        evaluation_date=ev,
        notes=clean(body.notes),
        added_by=user["username"],
        added_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return as_dict(m, ModelVersion)
