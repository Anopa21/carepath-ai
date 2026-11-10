import os
from typing import Optional

from pydantic import BaseModel, Field


class ModelNotConnected(Exception):
    pass


class AdultFeatures(BaseModel):
    """Inputs the adult model will receive. All optional, because data can be missing."""
    age: Optional[float] = Field(None, ge=18, le=120)
    sex: Optional[str] = None
    bmi: Optional[float] = Field(None, ge=10, le=80)
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    hba1c: Optional[float] = None
    fasting_glucose: Optional[float] = None
    total_cholesterol: Optional[float] = None


class ExplanationItem(BaseModel):
    feature: str
    contribution: float


class PredictionResponse(BaseModel):
    """What the real model must return."""
    model_name: str
    model_version: str
    risk_score: float
    risk_flag: bool
    explanation: list[ExplanationItem]
    evaluation_date: Optional[str] = None


def model_mode() -> str:
    return os.getenv("ADULT_MODEL_MODE", "not_connected")


def is_connected() -> bool:
    return model_mode() != "not_connected"


def predict_adult(features: AdultFeatures) -> PredictionResponse:
    if not is_connected():
        raise ModelNotConnected(
            "No adult model is connected. No risk score has been produced."
        )
    # The real model is loaded here later (exported file or API call).
    raise ModelNotConnected(
        f"Model mode '{model_mode()}' is set but the loader is not built yet."
    )