from sqlalchemy import BigInteger, Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


class MyBase(object):
    """Custom base class with default __repr__ method."""
    def __repr__(self):
        return '<{}: {}>'.format(self.__class__.__name__, self.id)


Base = declarative_base(cls=MyBase)
