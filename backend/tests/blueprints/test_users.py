import pytest

from common.testing.factories import UserFactory
from common.models import User


class TestUser(object):

    def test_get_user(self, db_session):
        UserFactory.create(
            uid='test',
            name='test_name',
        )
        db_session.commit()
