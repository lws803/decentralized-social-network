from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from common.constants import VisibilityType


class MyBase(object):
    """Custom base class with default __repr__ method."""
    def __repr__(self):
        return '<{}: {}>'.format(self.__class__.__name__, self.id)


Base = declarative_base(cls=MyBase)


class User(object):
    __tablename__ = 'users'
    id = Column(BigInteger, primary_key=True)
    uid = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    posts = relationship('Post', backref='user', cascade='all, delete-orphan')
    owned_groups = relationship('Group', backref='user', cascade='all, delete-orphan')


class Post(object):
    __tablename__ = 'posts'
    id = Column(BigInteger, primary_key=True)
    metadata = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    group_id = Column(ForeignKey('groups.id'), nullable=False)
    owner_id = Column(ForeignKey('users.id'), nullable=False)
    visibility = Column(Enum(VisibilityType), nullable=False)


class Group(object):
    __tablename__ = 'groups'
    id = Column(BigInteger, primary_key=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    owner_id = Column(ForeignKey('users.id'), nullable=False)
    admins = Column(JSON, nullable=True)

    posts = relationship('Post', backref='group', cascade='all, delete-orphan')


users = User.__table__
posts = Post.__table__
groups = Group.__table__
