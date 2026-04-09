from typing import List

from fastapi import APIRouter, HTTPException
from app.models.activity import Activity

router = APIRouter(prefix='/activities', tags=['activities'])
fake_db_activities : List[Activity] = []

@router.post('/', response_model=Activity | List[Activity], status_code=201)
def create_activity(activity: Activity | List[Activity]) -> Activity | List[Activity]:
    if isinstance(activity, list):
        created: List[Activity] = []
        for item in activity:
            item.id = len(fake_db_activities) + 1
            fake_db_activities.append(item)
            created.append(item)
        return created

    activity.id = len(fake_db_activities) + 1
    fake_db_activities.append(activity)
    return activity

@router.get('/', response_model = List[Activity])
def list_activities() -> List[Activity] :
    return fake_db_activities

@router.get('/{activity_id}', response_model = Activity)
def get_activity(activity_id : int) -> Activity :
    for activity in fake_db_activities :
        if activity.id == activity_id :
            return activity
    raise HTTPException(status_code = 404, detail = 'Activity not found')
