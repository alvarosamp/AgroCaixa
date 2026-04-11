from sqlachemy import Column, Integer, String, ForeignKey
from app.db import Base
from typing import Optional

class Activity(Base):
    __tablename__ = "activities"

    id: Optional[int] = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable= False, index = True)
    name = Column(String, nullable = False)
    type = Column(String, nullable = False)
    status = Column(String, nullable = False)
