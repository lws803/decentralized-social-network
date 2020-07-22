"""added blockchain tables

Revision ID: 7a812f4fc62c
Revises: 6fcb42694cbf
Create Date: 2020-07-22 12:37:03.247487

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '7a812f4fc62c'
down_revision = '6fcb42694cbf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blockchain',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('hash', sa.String(length=512), nullable=False),
    sa.Column('preceding_hash', sa.String(length=512), nullable=False),
    sa.Column('sql_statement', mysql.JSON(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('socialnetwork_version',
    sa.Column('version', sa.String(length=512), nullable=False),
    sa.PrimaryKeyConstraint('version')
    )
    op.create_table('trackers',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=False),
    sa.Column('status', sa.Enum('STALE', 'ACTIVE', name='trackerstatus'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trackers')
    op.drop_table('socialnetwork_version')
    op.drop_table('blockchain')
    # ### end Alembic commands ###
