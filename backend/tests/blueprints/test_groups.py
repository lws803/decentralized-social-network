from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema, Unordered

from common.authentication import encode_auth_token
from common.constants import SocialGroupRole
from common.messages import Errors
from common.models import SocialGroup, SocialGroupMember
from common.testing.factories import (
    SocialGroupFactory,
    SocialGroupMemberFactory,
)


@pytest.fixture
def db_cleanup(db_session):
    yield
    for model in (SocialGroup, SocialGroupMember):
        db_session.query(model).delete()
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
            'id': str,
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

    def test_delete_group_no_auth(
        self, db_cleanup, client, secondary_context, existing_group, db_session
    ):
        response = client.delete(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': 'fake'
            },
        )
        group = db_session.query(SocialGroup).filter_by(id=existing_group.id).one_or_none()

        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert group
        assert response.json['message'] == Errors.TOKEN_INVALID


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

    def test_edit_group_no_auth(
        self, db_cleanup, client, secondary_context, existing_group, db_session
    ):
        response = client.put(
            f'/api/v1/social_group/{existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': 'fake'
            },
            json={
                'name': 'very_cool', 'metadata_json': {'description': 'awesome'}
            }
        )
        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert response.json['message'] == Errors.TOKEN_INVALID

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


class TestGroupMembership(object):
    @pytest.fixture
    def existing_membership(db_session, secondary_context, existing_group, db_cleanup):
        SocialGroupMemberFactory.create(
            user_id=secondary_context['user_id'],
            social_group_id=existing_group.id,
            role=SocialGroupRole.MEMBER
        )

    def test_member_creation(self, db_cleanup, client, context, existing_group, secondary_context):
        response = client.post(
            '/api/v1/social_group/members/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'social_group_id': existing_group.id,
                'user_id': secondary_context['user_id'],
                'role': 'member'
            }
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema({
            'user_id': secondary_context['user_id'],
            'role': SocialGroupRole.MEMBER.name,
            'social_group_id': existing_group.id,
        })


    def test_get_member(
        self, db_cleanup, client, context, existing_group, secondary_context, existing_membership
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.get(
            (
                f'/api/v1/social_group/members/{secondary_user_id}'
                f'?social_group_id={existing_group.id}'
            ),
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
            'user_id': secondary_context['user_id'],
            'role': SocialGroupRole.MEMBER.name,
            'social_group_id': existing_group.id,
        })


    def test_delete_member(
        self, db_cleanup, client, context, existing_group, secondary_context, existing_membership
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.delete(
            f'/api/v1/social_group/members/{secondary_user_id}?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.ACCEPTED

    def test_delete_ownself(
        self, db_cleanup, client, context, existing_group, secondary_context, existing_membership
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.delete(
            f'/api/v1/social_group/members/{secondary_user_id}?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(secondary_user_id).decode()
            }
        )
        assert response.status_code == HTTPStatus.ACCEPTED

    def test_edit_member(
        self, db_cleanup, client, context, existing_group, secondary_context, existing_membership
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.put(
            f'/api/v1/social_group/members/{secondary_user_id}?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'role': 'admin'
            }
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema({
            'user_id': secondary_context['user_id'],
            'role': SocialGroupRole.ADMIN.name,
            'social_group_id': existing_group.id,
        })

    def test_list_members(
        self, db_cleanup, client, context, existing_group, existing_membership, db_session
    ):
        response = client.get(
            f'/api/v1/social_group/members?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        existing_members = (
            db_session.query(SocialGroupMember)
            .filter_by(social_group_id=existing_group.id)
        ).all()

        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema(
            {
                'members': Unordered(
                    [
                        {
                            'user_id': existing_member.user_id,
                            'role': existing_member.role.name,
                            'social_group_id': existing_group.id,
                        }
                        for existing_member in existing_members
                    ]
                ),
                'total_count': len(existing_members)
            }
        )

    def test_list_members_pagination(
        self, db_cleanup, client, context, existing_group, existing_membership, db_session
    ):
        response = client.get(
            (
                f'/api/v1/social_group/members?num_results_per_page=1'
                f'&page=1&social_group_id={existing_group.id}'
            ),
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        existing_members = (
            db_session.query(SocialGroupMember)
            .filter_by(social_group_id=existing_group.id)
        ).all()

        assert response.status_code == HTTPStatus.OK
        assert response.json['total_count'] == len(existing_members)
        assert len(response.json['members']) == 1


class TestGroupMembershipInvalid(object):
    def test_existing_member_creation(self, db_cleanup, client, context, existing_group):
        response = client.post(
            '/api/v1/social_group/members/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'social_group_id': existing_group.id,
                'user_id': context['user_id'],
                'role': 'member'
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.MEMBER_EXISTS

    def test_get_non_existent_member(
        self, db_cleanup, client, context, existing_group, secondary_context
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.get(
            f'/api/v1/social_group/members/{secondary_user_id}?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.NOT_FOUND

    def test_delete_non_existent_member(
        self, db_cleanup, client, context, existing_group, secondary_context
    ):
        secondary_user_id = secondary_context['user_id']
        response = client.delete(
            f'/api/v1/social_group/members/{secondary_user_id}?social_group_id={existing_group.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.NOT_FOUND

    def test_delete_member_without_perms(
        self, db_cleanup, client, context, existing_group, secondary_context
    ):
        user_id = context['user_id']
        response = client.delete(
            f'/api/v1/social_group/members/{user_id}?social_group_id={existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES

    def test_edit_member_without_perms(
        self, db_cleanup, client, context, existing_group, secondary_context
    ):
        user_id = context['user_id']
        response = client.delete(
            f'/api/v1/social_group/members/{user_id}?social_group_id={existing_group.id}',
            headers={
                'key': secondary_context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            },
            json={
                'role': 'member',
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES
