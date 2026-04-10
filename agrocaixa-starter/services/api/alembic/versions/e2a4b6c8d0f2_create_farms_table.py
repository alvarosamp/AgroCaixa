"""Create farms table

Revision ID: e2a4b6c8d0f2
Revises: d1e2f3a4b5c6
Create Date: 2026-04-10

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e2a4b6c8d0f2"
down_revision: Union[str, Sequence[str], None] = "d1e2f3a4b5c6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "farms",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("state", sa.String(), nullable=False),
        sa.Column("production_type", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_farms_id"), "farms", ["id"], unique=False)
    op.create_index(op.f("ix_farms_user_id"), "farms", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_farms_user_id"), table_name="farms")
    op.drop_index(op.f("ix_farms_id"), table_name="farms")
    op.drop_table("farms")
