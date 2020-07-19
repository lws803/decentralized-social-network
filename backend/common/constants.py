from enum import Enum


class VisibilityType(Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'


class VoteType(Enum):
    DOWN = 'down'
    UP = 'up'
