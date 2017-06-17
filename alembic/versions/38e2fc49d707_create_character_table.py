"""CREATE character table

Revision ID: 38e2fc49d707
Revises: 
Create Date: 2017-06-17 13:08:31.758963

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '38e2fc49d707'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'character',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False)
    )


def downgrade():
    op.drop_table('character')
