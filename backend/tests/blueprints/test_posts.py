from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema, Unordered
from voluptuous import Any, Coerce

from common.authentication import encode_auth_token
from common.constants import SocialGroupRole, VisibilityType
from common.messages import Errors
from common.models import Post, SocialGroup, SocialGroupMember, User, Tag
from common.testing.factories import (
    PostFactory,
    SocialGroupFactory,
    SocialGroupMemberFactory,
    UserFactory,
)


@pytest.fixture
def populate_db(db_session, context):
    UserFactory.create(
        id=context['user_id'],
        uid=context['uid'],
        name='test_name',
    )
    db_session.commit()
    yield
    for model in (User, Post, SocialGroup, SocialGroupMember, Tag):
        db_session.query(model).delete()
    db_session.commit()


class TestPost(object):
    @pytest.fixture
    def init_group_and_membership(self, populate_db, db_session, context):
        new_group = SocialGroupFactory.create(name='test_group')
        SocialGroupMemberFactory.create(
            user_id=context['user_id'],
            social_group_id=new_group.id,
            role=SocialGroupRole.ADMIN
        )
        db_session.commit()
        yield new_group

    @pytest.mark.parametrize(
        'body',
        [
            {'visibility': 'private', 'metadata_json': {'data': 'test_data'}},
            {'visibility': 'public', 'metadata_json': {'data': 'test_data'}},
            {
                'visibility': 'private',
                'metadata_json': {'data': 'test_data'},
                'tags': ['cool', 'beans'],
            },
        ]
    )
    def test_new_post(self, db_session, context, init_group_and_membership, client, body):
        new_group = init_group_and_membership
        response = client.post(
            '/api/v1/post/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'social_group_id': new_group.id,
                **body
            }
        )
        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
            'created_at': str,
            'depth': 0,
            'id': int,
            'metadata_json': body['metadata_json'],
            'social_group_id': new_group.id,
            'tags': Unordered(
                [
                    {
                        'created_at': str,
                        'updated_at': None,
                        'name': tag,
                        'id': int
                    }
                    for tag in body.get('tags', [])
                ]
            ),
            'updated_at': None,
            'user_id': context['user_id'],
            'visibility': VisibilityType(body['visibility']).name
        })
