from db import Base, SessionLocal, engine
import models  # noqa: F401
import registry  # noqa: F401
from registry import Dataset, ModelVersion

Base.metadata.create_all(bind=engine)

db = SessionLocal()
if db.query(ModelVersion).count() == 0:
    db.add(
        ModelVersion(
            name="Child rule-based demonstration logic",
            version="demo",
            population_group="child",
            model_type="rule_based_demo",
            status="demo_logic",
            notes="No child-specific predictive model exists. Adult models are never applied to children.",
            added_by="system",
        )
    )
    db.add(
        ModelVersion(
            name="Adult risk model (Python / Google Colab)",
            version=None,
            population_group="adult",
            model_type="ml_model",
            status="not_connected",
            evaluation_date=None,
            notes="Developed separately. Awaiting the exported model and real evaluation results.",
            added_by="system",
        )
    )
    db.commit()
print("models registered:", db.query(ModelVersion).count(), "| datasets registered:", db.query(Dataset).count())
db.close()
