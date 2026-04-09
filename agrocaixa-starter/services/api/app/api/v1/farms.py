from typing import List
from fastapi import APIRouter, HTTPException
from app.models.farm import Farm

router = APIRouter(prefix='/farms', tags=['farms'])

fake_db_farms : List[Farm] = []

@router.post('/', response_model=Farm, status_code=201)
def create_farm(farm : Farm) -> Farm :
    farm.id = len(fake_db_farms) + 1
    fake_db_farms.append(farm)
    return farm

@router.get('/', response_model = List[Farm])
def list_farms() -> List[Farm] :
    return fake_db_farms

@router.get('/{farm_id}', response_model = Farm)
def get_farm(farm_id : int) -> Farm :
    for farm in fake_db_farms :
        if farm.id == farm_id :
            return farm
    raise HTTPException(status_code = 404, detail = 'Farm not found')

