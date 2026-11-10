from datetime import date, timedelta

from db import Base, SessionLocal, engine
from models import Case

Base.metadata.create_all(bind=engine)
today = date.today()

demo_cases = [
    dict(person_ref="SYN-C-0001", population_group="child",
         flag_type="unmet_preventive_care",
         flag_reason="Demo rule: no Well-Child Visit recorded in the expected window.",
         pathway="well_child_visit", priority="medium", status="identified"),
    dict(person_ref="SYN-C-0002", population_group="child",
         flag_type="elevated_risk",
         flag_reason="Demo rule: growth indicator outside expected range (synthetic value).",
         pathway="well_child_visit", priority="high", status="awaiting_engagement"),
    dict(person_ref="SYN-C-0003", population_group="child",
         flag_type="unmet_preventive_care",
         flag_reason="Demo rule: Well-Child Visit overdue.",
         pathway="well_child_visit", priority="routine", status="appointment_scheduled"),
    dict(person_ref="SYN-A-0001", population_group="adult",
         flag_type="elevated_risk",
         flag_reason="Demo rule: blood pressure reading above threshold (synthetic value).",
         pathway="adult_comprehensive_screening", priority="high", status="identified"),
    dict(person_ref="SYN-A-0002", population_group="adult",
         flag_type="unmet_preventive_care",
         flag_reason="Demo rule: eligible for comprehensive screening, none on record.",
         pathway="adult_comprehensive_screening", priority="medium", status="appointment_recommended"),
    dict(person_ref="SYN-A-0003", population_group="adult",
         flag_type="elevated_risk",
         flag_reason="Demo rule: BMI and glucose indicators above threshold (synthetic values).",
         pathway="adult_comprehensive_screening", priority="high", status="follow_up_required"),
]

db = SessionLocal()
added = 0
for c in demo_cases:
    if not db.query(Case).filter_by(person_ref=c["person_ref"]).first():
        db.add(Case(**c, recommendation_date=today,
                    follow_up_date=today + timedelta(days=30),
                    data_origin="synthetic"))
        added += 1
db.commit()
db.close()
print(f"Added {added} synthetic cases.")