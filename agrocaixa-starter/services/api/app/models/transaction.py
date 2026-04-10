"""Compatibility re-export.

The canonical SQLAlchemy ORM model for the `transactions` table lives in
`app.db_models.transaction.Transaction`.

Keeping this module avoids breaking imports like:

    from app.models.transaction import Transaction

while preventing duplicate table declarations.
"""

from app.db_models.transaction import Transaction

__all__ = ["Transaction"]
