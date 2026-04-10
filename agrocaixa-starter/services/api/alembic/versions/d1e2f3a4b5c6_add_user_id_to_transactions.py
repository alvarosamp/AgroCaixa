"""Add user_id to transactions

Revision ID: d1e2f3a4b5c6
Revises: c4d1a1b2c3d4
Create Date: 2026-04-10

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d1e2f3a4b5c6"
down_revision: Union[str, Sequence[str], None] = "c4d1a1b2c3d4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column("user_id", sa.Integer(), nullable=True),
    )

    op.create_index(op.f("ix_transactions_user_id"), "transactions", ["user_id"], unique=False)
    op.create_foreign_key(
        op.f("fk_transactions_user_id_users"),
        "transactions",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(op.f("fk_transactions_user_id_users"), "transactions", type_="foreignkey")
    op.drop_index(op.f("ix_transactions_user_id"), table_name="transactions")
    op.drop_column("transactions", "user_id")
