from pydantic import BaseModel, Field


class ActivityCreate(BaseModel):
    farm_id: int
    name: str = Field(..., min_length=2, max_length=120)
    type: str = Field(..., min_length=2, max_length=120)
    status: str = Field(..., min_length=2, max_length=60)


class ActivityResponse(ActivityCreate):
    id: int

    class Config:
        from_attributes = True
