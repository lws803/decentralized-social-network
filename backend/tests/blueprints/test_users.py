from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema
from voluptuous import Any

from common.authentication import encode_auth_token, decode_auth_token
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
