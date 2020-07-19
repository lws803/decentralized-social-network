from http import HTTPStatus

import pytest

from common.authentication import encode_auth_token
from common.models import User
from common.testing.factories import UserFactory


class TestUser(object):

    @pytest.fixture
    def populate_db(self, db_session, context):
        UserFactory.create(
            id=context['user_id'],
            uid=context['uid'],
            name='test_name',
        )
        db_session.commit()

        yield
        db_session.query(User).delete()
        db_session.commit()

    def test_get_user(self, populate_db, db_session, client, context):
        response = client.get(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            }
        )
        assert response.status_code == HTTPStatus.OK
