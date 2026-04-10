from pydantic import BaseModel, Field


class FarmCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    city: str = Field(..., min_length=2, max_length=120)
    state: str = Field(..., min_length=2, max_length=2)
    production_type: str = Field(..., min_length=2, max_length=120)


class FarmResponse(FarmCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
