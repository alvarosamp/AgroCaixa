from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmResponse

router = APIRouter(prefix="/farms", tags=["farms"])


@router.post("/", response_model=FarmResponse, status_code=201)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FarmResponse:
    db_farm = Farm(
        user_id=current_user.id,
        name=farm.name,
        city=farm.city,
        state=farm.state,
        production_type=farm.production_type,
    )

    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    return db_farm


@router.get("/", response_model=List[FarmResponse])
def list_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FarmResponse]:
    farms = db.query(Farm).filter(Farm.user_id == current_user.id).all()
    return farms


@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FarmResponse:
    farm = (
        db.query(Farm)
        .filter(Farm.id == farm_id, Farm.user_id == current_user.id)
        .first()
    )

    if farm is None:
        raise HTTPException(status_code=404, detail="Fazenda não encontrada")

    return farm
