from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    func,
    Integer,
)
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from common.constants import VisibilityType, VoteType, SocialGroupRole


class MyBase(object):
    """Custom base class with default __repr__ method."""
    def __repr__(self):
        return '<{}: {}>'.format(self.__class__.__name__, self.id)


Base = declarative_base(cls=MyBase)


class User(Base):
    __tablename__ = 'users'
    id = Column(BigInteger, primary_key=True)
    uid = Column(String(255), nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    posts = relationship('Post', backref='user', cascade='all, delete-orphan')


class Post(Base):
    __tablename__ = 'posts'
    id = Column(BigInteger, primary_key=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    social_group_id = Column(ForeignKey('social_groups.id'), nullable=False)
    owner_id = Column(ForeignKey('users.id'), nullable=False)
    visibility = Column(Enum(VisibilityType), nullable=False)
    # FIXME: May raise a circular reference. Add constraints to ensure
    depth = Column(Integer, nullable=False, default=0)

    votes = relationship('Vote', backref='post', cascade='all, delete-orphan')
    tags = relationship('Tag', backref='post', cascade='all, delete-orphan')


class PostChild(Base):
    __tablename__ = 'post_children'
    id = Column(BigInteger, primary_key=True)
    parent_post_id = Column(ForeignKey('posts.id'), nullable=False)
    child_post_id = Column(ForeignKey('posts.id'), nullable=False)


class Vote(Base):
    __tablename__ = 'votes'
    id = Column(BigInteger, primary_key=True)
    vote_type = Column(Enum(VoteType), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    owner_id = Column(ForeignKey('users.id'), nullable=False)
    post_id = Column(ForeignKey('posts.id'), nullable=False)


class SocialGroup(Base):
    __tablename__ = 'social_groups'
    id = Column(BigInteger, primary_key=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    posts = relationship('Post', backref='social_group', cascade='all, delete-orphan')
    members = relationship(
        'SocialGroupMember', backref='social_group', cascade='all, delete-orphan'
    )


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(BigInteger, primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    post_id = Column(ForeignKey('posts.id'), nullable=False)


class SocialGroupMember(Base):
    __tablename__ = 'social_group_members'
    id = Column(BigInteger, primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    user_id = Column(ForeignKey('users.id'), nullable=False)
    social_group_id = Column(ForeignKey('social_groups.id'), nullable=False)
    role = Column(Enum(SocialGroupRole), nullable=False)


users = User.__table__
posts = Post.__table__
social_groups = SocialGroup.__table__
votes = Vote.__table__
social_group_members = SocialGroupMember.__table__
tags = Tag.__table__
post_children = PostChild.__table__
