"""Create activities table

Revision ID: f3a1c2b3d4e5
Revises: e2a4b6c8d0f2
Create Date: 2026-04-11

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f3a1c2b3d4e5"
down_revision: Union[str, Sequence[str], None] = "e2a4b6c8d0f2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "activities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("farm_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["farm_id"],
            ["farms.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_activities_id"), "activities", ["id"], unique=False)
    op.create_index(
        op.f("ix_activities_farm_id"),
        "activities",
        ["farm_id"],
        unique=False,
    )

    # Keep backward compatibility with existing schema, but add an FK-friendly column.
    op.add_column(
        "transactions",
        sa.Column("activity_id", sa.Integer(), nullable=True),
    )
    op.create_index(
        op.f("ix_transactions_activity_id"),
        "transactions",
        ["activity_id"],
        unique=False,
    )
    op.create_foreign_key(
        op.f("fk_transactions_activity_id_activities"),
        "transactions",
        "activities",
        ["activity_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        op.f("fk_transactions_activity_id_activities"),
        "transactions",
        type_="foreignkey",
    )
    op.drop_index(op.f("ix_transactions_activity_id"), table_name="transactions")
    op.drop_column("transactions", "activity_id")

    op.drop_index(op.f("ix_activities_farm_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_id"), table_name="activities")
    op.drop_table("activities")
