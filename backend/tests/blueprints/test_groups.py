from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema

from common.authentication import encode_auth_token
from common.messages import Errors
from common.models import SocialGroup
from common.constants import SocialGroupRole
from common.testing.factories import SocialGroupFactory, SocialGroupMemberFactory


@pytest.fixture
def db_cleanup(db_session):
    yield
    db_session.query(SocialGroup).delete()
    db_session.commit()


@pytest.fixture
def existing_group(db_session, context):
    existing_group = SocialGroupFactory.create(
        name='test_group',
        metadata_json={
            'description': 'helloworld'
        }
    )
    SocialGroupMemberFactory.create(
        social_group_id=existing_group.id,
        user_id=context['user_id'],
        role=SocialGroupRole.ADMIN,
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

    def test_get_group(self, db_cleanup, client, context, existing_group, db_session):
        response = client.get(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        group = db_session.query(SocialGroup).filter_by(id=existing_group.id).one_or_none()

        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
            'id': group.id,
            'metadata_json': group.metadata_json,
            'name': group.name,
        })

    def test_delete_group(self, db_cleanup, client, context, existing_group, db_session):
        response = client.delete(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        group = db_session.query(SocialGroup).filter_by(id=existing_group.id).one_or_none()

        assert response.status_code == HTTPStatus.ACCEPTED
        assert not group

    @pytest.mark.parametrize(
        'body',
        [
            {'name': 'very_cool'},
            {'name': 'very_cool', 'metadata_json': {'description': 'awesome'}}
        ]
    )
    def test_edit_group(self, db_cleanup, client, context, existing_group, db_session, body):
        group = existing_group
        response = client.put(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json=body
        )

        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema({
            'id': group.id,
            'metadata_json': body.get('metadata_json') or group.metadata_json,
            'name': body.get('name') or group.name,
        })


class TestGroupInvalid(object):
    @pytest.fixture
    def another_existing_group(self, db_session, db_cleanup):
        SocialGroupFactory.create(
            name='another_group'
        )
        db_session.commit()

    def test_delete_group_bad_auth(
        self, db_cleanup, client, secondary_context, existing_group, db_session
    ):
        response = client.delete(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            },
        )
        group = db_session.query(SocialGroup).filter_by(id=existing_group.id).one_or_none()

        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert group
        assert response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES

    def test_edit_group_bad_auth(
        self, db_cleanup, client, secondary_context, existing_group, db_session
    ):
        response = client.put(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            },
            json={
                'name': 'very_cool', 'metadata_json': {'description': 'awesome'}
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES

    def test_edit_group_duplicate_name(
        self, db_cleanup, client, context, existing_group, db_session,
        another_existing_group
    ):
        response = client.put(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'name': 'another_group'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.GROUP_EXISTS

    def test_create_group_duplicate_name(
        self, db_cleanup, client, context, db_session, another_existing_group
    ):
        response = client.post(
            '/api/v1/social_group/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'name': 'another_group'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.GROUP_EXISTS
