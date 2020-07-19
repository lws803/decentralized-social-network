from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema
from voluptuous import Any

from common.authentication import decode_auth_token, encode_auth_token
from common.messages import Errors
from common.models import User
from common.testing.factories import UserFactory


@pytest.fixture
def populate_db(db_session, context):
    UserFactory.create(
        id=context['user_id'],
        uid=context['uid'],
        name='test_name',
    )
    UserFactory.create(
        uid='another_uid',
        name='test_name_2',
    )
    db_session.commit()
    yield
    db_session.query(User).delete()
    db_session.commit()


class TestUser(object):

    def test_get_user(self, populate_db, db_session, client, context):
        response = client.get(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            }
        )
        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
            'name': 'test_name',
            'id': context['user_id'],
            'metadata_json': Any(None, dict),
            'updated_at': None,
            'created_at': str,
        })

    def test_login_user(self, populate_db, db_session, client, context):
        response = client.post(
            '/api/v1/user/login',
            headers={
                'key': context['api_key'],
                'user': context['uid']
            }
        )
        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
            'token': str,
            'id': context['user_id'],
            'name': 'test_name'
        })
        assert decode_auth_token(response.json['token']) == context['user_id']

    @pytest.mark.parametrize(
        'body',
        [
            {'name': 'test'},
            {'name': 'hello_world'},
            {'name': 'hello_world', 'metadata_json': {'cool': 'test'}},
        ]
    )
    def test_create_user(self, populate_db, db_session, client, context, body):
        response = client.post(
            '/api/v1/user/new',
            headers={
                'key': context['api_key'],
                'user': 'new_uid'
            },
            json=body
        )
        assert response.status_code == HTTPStatus.ACCEPTED

        new_user = db_session.query(User).filter_by(uid='new_uid').one_or_none()
        assert response.json == Schema({
            'token': str,
            'id': new_user.id,
            'name': body['name']
        })
        assert decode_auth_token(response.json['token']) == new_user.id

    @pytest.mark.parametrize(
        'body',
        [
            {'name': 'test'},
            {'name': 'hello_world'},
            {'name': 'hello_world', 'metadata_json': {'cool': 'test'}},
        ]
    )
    def test_edit_user(self, populate_db, db_session, client, context, body):
        response = client.put(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json=body
        )
        assert response.status_code == HTTPStatus.ACCEPTED

        assert response.json == Schema({
            'id': context['user_id'],
            'created_at': str,
            'updated_at': str,
            'name': body['name'],
            'metadata_json': body.get('metadata_json')
        })

    def test_delete_user(self, populate_db, db_session, client, context):
        response = client.delete(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert db_session.query(User).filter_by(id=context['user_id']).one_or_none() is None


class TestUserInvalid(object):
    def test_login_user_invalid(self, populate_db, db_session, client, context):
        response = client.post(
            '/api/v1/user/login',
            headers={
                'key': context['api_key'],
                'user': 'unknown_user'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST

    def test_bad_api_key(self, populate_db, db_session, client, context):
        response = client.post(
            '/api/v1/user/login',
            headers={
                'key': 'unknown_key',
                'user': context['uid']
            }
        )
        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert response.json['message'] == Errors.INCORRECT_API_KEY

    def test_bad_auth(self, populate_db, db_session, client, context):
        response = client.get(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': 'bad_key'
            }
        )
        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert response.json['message'] == Errors.TOKEN_INVALID

    def test_create_user_same_name(self, populate_db, db_session, client, context):
        response = client.post(
            '/api/v1/user/new',
            headers={
                'key': context['api_key'],
                'user': 'new_uid'
            },
            json={
                'name': 'test_name'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.USER_NAME_EXISTS

    def test_edit_user_same_name(self, populate_db, db_session, client, context):
        response = client.put(
            '/api/v1/user',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'name': 'test_name_2'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.USER_NAME_EXISTS
