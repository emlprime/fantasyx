"""Create tables from scratch

Revision ID: 4755e4670611
Revises: 
Create Date: 2017-07-08 09:19:05.074778

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4755e4670611'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('character',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('draft_ticket',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_identifier', sa.String(), nullable=False),
    sa.Column('sort', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_draft_ticket_sort'), 'draft_ticket', ['sort'], unique=False)
    op.create_index(op.f('ix_draft_ticket_user_identifier'), 'draft_ticket', ['user_identifier'], unique=False)
    op.create_table('episode',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('number', sa.String(), nullable=True),
    sa.Column('aired_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_episode_number'), 'episode', ['number'], unique=False)
    op.create_table('rubric',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('kind', sa.String(), nullable=True),
    sa.Column('points', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('seat_of_power', sa.String(), nullable=False),
    sa.Column('family_words', sa.String(), nullable=False),
    sa.Column('image', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('identifier', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('refresh_token', sa.String(), nullable=True),
    sa.Column('access_token', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('family_words'),
    sa.UniqueConstraint('identifier'),
    sa.UniqueConstraint('image'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('seat_of_power')
    )
    op.create_table('draft',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('character_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('drafted_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['character_id'], ['character.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_draft_character_id'), 'draft', ['character_id'], unique=False)
    op.create_index(op.f('ix_draft_user_id'), 'draft', ['user_id'], unique=False)
    op.create_table('draft_history',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('character_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('drafted_at', sa.DateTime(), nullable=False),
    sa.Column('released_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['character_id'], ['character.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_draft_history_character_id'), 'draft_history', ['character_id'], unique=False)
    op.create_index(op.f('ix_draft_history_user_id'), 'draft_history', ['user_id'], unique=False)
    op.create_table('score',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('character_id', sa.Integer(), nullable=False),
    sa.Column('draft_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('rubric_id', sa.Integer(), nullable=False),
    sa.Column('episode_number', sa.String(), nullable=True),
    sa.Column('points', sa.Integer(), nullable=True),
    sa.Column('bonus', sa.Integer(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['character_id'], ['character.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['draft_id'], ['draft.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['rubric_id'], ['rubric.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_score_character_id'), 'score', ['character_id'], unique=False)
    op.create_index(op.f('ix_score_draft_id'), 'score', ['draft_id'], unique=False)
    op.create_index(op.f('ix_score_rubric_id'), 'score', ['rubric_id'], unique=False)
    op.create_index(op.f('ix_score_user_id'), 'score', ['user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_score_user_id'), table_name='score')
    op.drop_index(op.f('ix_score_rubric_id'), table_name='score')
    op.drop_index(op.f('ix_score_draft_id'), table_name='score')
    op.drop_index(op.f('ix_score_character_id'), table_name='score')
    op.drop_table('score')
    op.drop_index(op.f('ix_draft_history_user_id'), table_name='draft_history')
    op.drop_index(op.f('ix_draft_history_character_id'), table_name='draft_history')
    op.drop_table('draft_history')
    op.drop_index(op.f('ix_draft_user_id'), table_name='draft')
    op.drop_index(op.f('ix_draft_character_id'), table_name='draft')
    op.drop_table('draft')
    op.drop_table('user')
    op.drop_table('rubric')
    op.drop_index(op.f('ix_episode_number'), table_name='episode')
    op.drop_table('episode')
    op.drop_index(op.f('ix_draft_ticket_user_identifier'), table_name='draft_ticket')
    op.drop_index(op.f('ix_draft_ticket_sort'), table_name='draft_ticket')
    op.drop_table('draft_ticket')
    op.drop_table('character')
    # ### end Alembic commands ###
