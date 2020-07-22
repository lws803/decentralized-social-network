import uuid

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator

from common.constants import (
    SocialGroupRole,
    TrackerStatus,
    VisibilityType,
    VoteType,
)


Base = declarative_base()


class MyBase(object):
    """Custom base class with default __repr__ method."""
    def __repr__(self):
        return '<{}: {}>'.format(self.__class__.__name__, self.id)


Base = declarative_base(cls=MyBase)


class GUID(TypeDecorator):
    impl = String(32)

    def process_bind_param(self, value, dialect):
        if value is not None:
            if isinstance(value, uuid.UUID):
                return "%.32x" % int(value)
            else:
                return value
        else:
            return None

    def process_result_value(self, value, dialect):
        return value


class User(Base):
    __tablename__ = 'users'
    __table_args__ = (
        UniqueConstraint('name', name='uix_name'),
    )
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    uid = Column(String(255), nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    posts = relationship('Post', backref='user', cascade='all, delete-orphan')


class Post(Base):
    __tablename__ = 'posts'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    social_group_id = Column(ForeignKey('social_groups.id', ondelete='CASCADE'), nullable=False)
    owner_id = Column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    visibility = Column(Enum(VisibilityType), nullable=False)
    depth = Column(Integer, nullable=False, default=0)

    votes = relationship('Vote', backref='post', cascade='all, delete-orphan')
    tags = relationship('Tag', backref='post', cascade='all, delete-orphan')


class PostChild(Base):
    __tablename__ = 'post_children'
    id = Column(BigInteger, primary_key=True)
    parent_post_id = Column(ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    child_post_id = Column(ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)


class Vote(Base):
    __tablename__ = 'votes'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    vote_type = Column(Enum(VoteType), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    owner_id = Column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    post_id = Column(ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)


class SocialGroup(Base):
    __tablename__ = 'social_groups'
    __table_args__ = (
        UniqueConstraint('name', name='uix_name'),
    )
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    posts = relationship('Post', backref='social_group', cascade='all, delete-orphan')
    members = relationship(
        'SocialGroupMember', backref='social_group', cascade='all, delete-orphan'
    )


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    post_id = Column(ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)


class SocialGroupMember(Base):
    __tablename__ = 'social_group_members'
    id = Column(BigInteger, primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    user_id = Column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    social_group_id = Column(ForeignKey('social_groups.id', ondelete='CASCADE'), nullable=False)
    role = Column(Enum(SocialGroupRole), nullable=False)


class Blockchain(Base):
    __tablename__ = 'blockchain'
    id = Column(BigInteger, primary_key=True)
    hash = Column(String(512), nullable=False)
    preceding_hash = Column(String(512), nullable=False)
    sql_statement = Column(JSON, nullable=False)


class Tracker(Base):
    __tablename__ = 'trackers'
    id = Column(BigInteger, primary_key=True)
    url = Column(String(255), nullable=False)
    status = Column(Enum(TrackerStatus), nullable=False)


class SocialNetworkVersion(Base):
    __tablename__ = 'socialnetwork_version'
    version = Column(String(512), primary_key=True)


users = User.__table__
posts = Post.__table__
social_groups = SocialGroup.__table__
votes = Vote.__table__
social_group_members = SocialGroupMember.__table__
tags = Tag.__table__
post_children = PostChild.__table__
blockchain = Blockchain.__table__
trackers = Tracker.__table__
socialnetwork_version = SocialNetworkVersion.__table__
