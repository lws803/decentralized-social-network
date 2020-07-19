import factory

from common import models
from common.testing.utils import get_scoped_db_session


class BaseFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Base model factory."""
    class Meta:
        abstract = True
        sqlalchemy_session_persistence = 'commit'
        sqlalchemy_session = get_scoped_db_session()


class UserFactory(BaseFactory):
    """User model factory."""
    class Meta:
        model = models.User


class PostFactory(BaseFactory):
    """Post model factory."""
    class Meta:
        model = models.Post


class SocialGroupFactory(BaseFactory):
    """SocialGroup model factory."""
    class Meta:
        model = models.SocialGroup


class SocialGroupMemberFactory(BaseFactory):
    """SocialGroupMember model factory."""
    class Meta:
        model = models.SocialGroupMember
