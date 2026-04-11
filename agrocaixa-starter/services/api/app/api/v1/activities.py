from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.activity import Activity
from app.models.farm import Farm
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse

router = APIRouter(prefix="/activities", tags=["activities"])


@router.post("/", response_model=ActivityResponse, status_code=201)
def create_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ActivityResponse:
    farm = (
        db.query(Farm)
        .filter(Farm.id == activity.farm_id, Farm.user_id == current_user.id)
        .first()
    )

    if farm is None:
        raise HTTPException(status_code=404, detail="Fazenda não encontrada")

    db_activity = Activity(
        farm_id=activity.farm_id,
        name=activity.name,
        type=activity.type,
        status=activity.status,
    )

    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


@router.get("/", response_model=List[ActivityResponse])
def list_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ActivityResponse]:
    activities = (
        db.query(Activity)
        .join(Farm, Activity.farm_id == Farm.id)
        .filter(Farm.user_id == current_user.id)
        .order_by(Activity.id.desc())
        .all()
    )
    return activities


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ActivityResponse:
    activity = (
        db.query(Activity)
        .join(Farm, Activity.farm_id == Farm.id)
        .filter(Activity.id == activity_id, Farm.user_id == current_user.id)
        .first()
    )

    if activity is None:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    return activity
