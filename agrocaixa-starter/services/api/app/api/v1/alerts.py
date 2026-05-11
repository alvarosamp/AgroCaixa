from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.alert_services import (
    count_unread_alerts,
    list_financial_alerts,
    mark_alert_as_read,
)
from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.alert import FinancialAlertResponse, UnreadAlertsResponse

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/", response_model=List[FinancialAlertResponse])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FinancialAlertResponse]:
    return list_financial_alerts(db, current_user.id)


@router.get("/unread-count", response_model=UnreadAlertsResponse)
def get_unread_alerts_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UnreadAlertsResponse:
    return UnreadAlertsResponse(
        unread_count=count_unread_alerts(db, current_user.id)
    )


@router.patch("/{alert_id}/read")
def read_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    alert = mark_alert_as_read(db, current_user.id, alert_id)

    if alert is None:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    return {"message": "Alerta marcado como lido"}
