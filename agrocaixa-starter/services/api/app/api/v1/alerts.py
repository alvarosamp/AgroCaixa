from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.alert import FinancialAlert
from app.models.user import User
from app.schemas.alert import FinancialAlertResponse, UnreadAlertsResponse

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/", response_model=List[FinancialAlertResponse])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FinancialAlertResponse]:
    alerts = (
        db.query(FinancialAlert)
        .filter(FinancialAlert.user_id == current_user.id)
        .order_by(FinancialAlert.date.desc())
        .all()
    )

    return alerts


@router.get("/unread-count", response_model=UnreadAlertsResponse)
def get_unread_alerts_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UnreadAlertsResponse:
    unread_count = (
        db.query(FinancialAlert)
        .filter(
            FinancialAlert.user_id == current_user.id,
            FinancialAlert.read == False,
        )
        .count()
    )

    return UnreadAlertsResponse(unread_count=unread_count)


@router.patch("/{alert_id}/read", response_model=FinancialAlertResponse)
def mark_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FinancialAlertResponse:
    alert = (
        db.query(FinancialAlert)
        .filter(
            FinancialAlert.id == alert_id,
            FinancialAlert.user_id == current_user.id,
        )
        .first()
    )

    if not alert:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    alert.read = True
    db.commit()
    db.refresh(alert)

    return alert
