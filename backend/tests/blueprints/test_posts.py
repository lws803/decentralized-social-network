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

    @pytest.fixture
    def create_existing_post(self, populate_db, db_session, context, init_group_and_membership):
        social_group = init_group_and_membership
        new_post = PostFactory.create(
            social_group_id=social_group.id,
            owner_id=context['user_id'],
            visibility=VisibilityType.PUBLIC.name,
        )
        db_session.commit()
        yield new_post


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

    def test_get_posts(self, db_session, context, create_existing_post, client):
        response = client.get(
            '/api/v1/posts',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.OK
        posts = db_session.query(Post).all()
        assert response.json == Schema(
            {
                'posts': Unordered([
                    {
                        'created_at': str,
                        'updated_at': None,
                        'depth': 0,
                        'id': int,
                        'metadata_json': post.metadata_json,
                        'social_group_id': post.social_group_id,
                        'tags': Unordered([
                            {
                                'created_at': str,
                                'updated_at': None,
                                'name': tag.name,
                                'id': int
                            }
                            for tag in post.tags
                        ]),
                        'user_id': context['user_id'],
                        'visibility': post.visibility.name
                    }
                    for post in posts
                ]),
                'total_count': len(posts)
            }
        )
