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
    pathway = Column(String)
    priority = Column(String)
    status = Column(String, default="identified")
    recommendation_date = Column(Date)
    follow_up_date = Column(Date)
    data_origin = Column(String, default="synthetic")
