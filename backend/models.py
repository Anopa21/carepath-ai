from sqlalchemy import Column, Date, Integer, String, Text

from db import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    person_ref = Column(String, unique=True, index=True)
    population_group = Column(String)
    flag_type = Column(String)
    flag_reason = Column(Text)
    flag_reason_ar = Column(Text)
    details_json = Column(Text)
    consent_status = Column(String, default="not_recorded")
    preferred_language = Column(String, default="ar")
    preferred_channel = Column(String, default="none")
    consent_updated_by = Column(String)
    consent_updated_at = Column(String)
    pathway = Column(String)
    priority = Column(String)
    status = Column(String, default="identified")
    recommendation_date = Column(Date)
    follow_up_date = Column(Date)
    data_origin = Column(String, default="synthetic")
