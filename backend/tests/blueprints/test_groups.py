from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema

from common.authentication import encode_auth_token
from common.messages import Errors
from common.models import SocialGroup
from common.testing.factories import SocialGroupFactory


@pytest.fixture
def db_cleanup(db_session):
    yield
    db_session.query(SocialGroup).delete()
    db_session.commit()


@pytest.fixture
def existing_group(db_session):
    existing_group = SocialGroupFactory.create(
        name='test_group',
        metadata_json={
            'description': 'helloworld'
        }
    )
    yield existing_group


class TestGroup(object):

    @pytest.mark.parametrize(
        'body',
        [
            {'name': 'cool'},
            {'name': 'cool', 'metadata_json': {'description': 'rad'}}
        ]
    )
    def test_group_creation(self, db_cleanup, client, context, body):
        response = client.post(
            '/api/v1/social_group/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json=body
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema({
            'id': int,
            'metadata_json': body.get('metadata_json'),
            'name': body['name'],
        })
