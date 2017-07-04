"""removed returned_at from draft

Revision ID: b5aa9a6a02f6
Revises: f51bc803aed3
Create Date: 2017-07-04 09:29:06.503752

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b5aa9a6a02f6'
down_revision = 'f51bc803aed3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('draft', 'returned_at')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('draft', sa.Column('returned_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
