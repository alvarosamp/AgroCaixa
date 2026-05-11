"""Create financial alerts table

Revision ID: a7c9d1e2f4b6
Revises: f3a1c2b3d4e5
Create Date: 2026-05-09

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a7c9d1e2f4b6"
down_revision: Union[str, Sequence[str], None] = "f3a1c2b3d4e5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "financial_alerts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("message", sa.String(), nullable=False),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("key", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_financial_alerts_date"),
        "financial_alerts",
        ["date"],
        unique=False,
    )
    op.create_index(
        op.f("ix_financial_alerts_id"),
        "financial_alerts",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_financial_alerts_key"),
        "financial_alerts",
        ["key"],
        unique=False,
    )
    op.create_index(
        op.f("ix_financial_alerts_read"),
        "financial_alerts",
        ["read"],
        unique=False,
    )
    op.create_index(
        op.f("ix_financial_alerts_type"),
        "financial_alerts",
        ["type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_financial_alerts_user_id"),
        "financial_alerts",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_financial_alerts_user_id"), table_name="financial_alerts")
    op.drop_index(op.f("ix_financial_alerts_type"), table_name="financial_alerts")
    op.drop_index(op.f("ix_financial_alerts_read"), table_name="financial_alerts")
    op.drop_index(op.f("ix_financial_alerts_key"), table_name="financial_alerts")
    op.drop_index(op.f("ix_financial_alerts_id"), table_name="financial_alerts")
    op.drop_index(op.f("ix_financial_alerts_date"), table_name="financial_alerts")
    op.drop_table("financial_alerts")
