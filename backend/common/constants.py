from enum import Enum


class VisibilityType(Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'


class VoteType(Enum):
    DOWN = 'down'
    UP = 'up'


class SocialGroupRole(Enum):
    ADMIN = 'admin'
    MEMBER = 'member'


class TrackerStatus(Enum):
    STALE = 'stale'
    ACTIVE = 'active'
