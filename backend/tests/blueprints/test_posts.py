from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema, Unordered

from common.authentication import encode_auth_token
from common.constants import SocialGroupRole, VisibilityType
from common.messages import Errors
from common.models import Post, SocialGroup, SocialGroupMember, Tag
from common.testing.factories import (
    PostFactory,
    SocialGroupFactory,
    SocialGroupMemberFactory,
)


@pytest.fixture
def populate_db(db_session, context, secondary_context):
    yield
    for model in (Post, SocialGroup, SocialGroupMember, Tag):
        db_session.query(model).delete()
    db_session.commit()


@pytest.fixture
def init_group_and_membership(populate_db, db_session, context):
    new_group = SocialGroupFactory.create(name='test_group')
    SocialGroupMemberFactory.create(
        user_id=context['user_id'],
        social_group_id=new_group.id,
        role=SocialGroupRole.ADMIN
    )
    db_session.commit()
    yield new_group


@pytest.fixture
def init_second_membership(init_group_and_membership, db_session, secondary_context):
    group = init_group_and_membership
    SocialGroupMemberFactory.create(
        user_id=secondary_context['user_id'],
        social_group_id=group.id,
        role=SocialGroupRole.MEMBER
    )
    db_session.commit()
    yield group


@pytest.fixture
def create_existing_post(populate_db, db_session, context, init_group_and_membership):
    social_group = init_group_and_membership
    new_post = PostFactory.create(
        social_group_id=social_group.id,
        owner_id=context['user_id'],
        visibility=VisibilityType.PUBLIC.name,
    )
    db_session.commit()
    yield new_post


@pytest.fixture
def create_multiple_existing_post(populate_db, db_session, context, init_group_and_membership):
    social_group = init_group_and_membership
    new_posts = []
    for i in range(100):
        new_posts.append(
            PostFactory.create(
                social_group_id=social_group.id,
                owner_id=context['user_id'],
                visibility=VisibilityType.PUBLIC.name,
            )
        )
    db_session.commit()
    yield new_posts


class TestPost(object):
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
    def test_new_post(self, context, init_group_and_membership, client, body):
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
        assert response.status_code == HTTPStatus.ACCEPTED
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
            '/api/v1/posts?num_results_per_page=10&page=1',
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

    def test_get_posts_with_pagination(
        self, db_session, context, create_multiple_existing_post, client
    ):
        response = client.get(
            '/api/v1/posts?num_results_per_page=20&page=1',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.OK
        post_count = db_session.query(Post).count()

        assert len(response.json['posts']) == 20
        assert response.json['total_count'] == post_count

    def test_get_post(self, context, create_existing_post, client):
        post = create_existing_post
        response = client.get(
            f'/api/v1/post/{post.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.OK
        assert response.json == Schema({
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
        })

    def test_delete_post(self, db_session, context, create_existing_post, client):
        post = create_existing_post
        response = client.delete(
            f'/api/v1/post/{post.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert not db_session.query(Post).filter_by(id=post.id).one_or_none()

    @pytest.mark.parametrize(
        'body',
        [
            {'visibility': 'private'},
            {'metadata_json': {'data': 'test_data'}},
            {
                'visibility': 'private',
                'metadata_json': {'data': 'test_data'},
                'tags': ['awesome', 'beans'],
            },
        ]
    )
    def test_edit_post(self, context, create_existing_post, client, body):
        post = create_existing_post
        response = client.put(
            f'/api/v1/post/{post.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json=body
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema({
            'created_at': str,
            'updated_at': str,
            'depth': 0,
            'id': int,
            'metadata_json': body.get('metadata_json') or post.metadata_json,
            'social_group_id': post.social_group_id,
            'tags': Unordered([
                {
                    'created_at': str,
                    'updated_at': None,
                    'name': tag.name if not isinstance(tag, str) else tag,
                    'id': int
                }
                for tag in body.get('tags') or post.tags
            ]),
            'user_id': context['user_id'],
            'visibility': (
                VisibilityType(body.get('visibility')).name
                if body.get('visibility') else post.visibility.name
            )
        })


class TestPostInvalid(object):
    def test_unauthorize_post_creation(self, context, init_group_and_membership, client):
        new_group = init_group_and_membership
        response = client.post(
            '/api/v1/post/new',
            headers={
                'key': context['api_key'],
                'Authorization': 'fake_auth'
            },
            json={
                'social_group_id': new_group.id,
                'visibility': 'private', 'metadata_json': {'data': 'test_data'}
            }
        )
        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert response.json['message'] == Errors.TOKEN_INVALID


    def test_post_creation_from_outside_group(self, context, init_group_and_membership, client):
        new_group = init_group_and_membership
        response = client.post(
            '/api/v1/post/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'social_group_id': new_group.id + 10,
                'visibility': 'private', 'metadata_json': {'data': 'test_data'}
            }
        )
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES


    @pytest.mark.parametrize(
        'body, error_message',
        [
            (
                {'visibility': 'private', 'metadata_json': {'test': 'cool'}},
                "required key not provided @ data['metadata_json']['data']",
            ),
            (
                {'visibility': 'hello', 'metadata_json': {'data': 'test_data'}},
                "expected VisibilityType for dictionary value @ data['visibility']"
            ),
            (
                {
                    'visibility': 'private',
                    'metadata_json': {'data': 'test_data'},
                    'tags': [{'cool': 'test'}, 'beans'],
                },
                "expected str @ data['tags'][0]"
            ),
        ]
    )
    def test_bad_post_creation(
        self, context, init_group_and_membership, client, body, error_message
    ):
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
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert response.json['message'] == error_message

    def test_delete_edit_unauthorized_post(
        self, context, init_second_membership, client,
        secondary_context, create_existing_post
    ):
        post = create_existing_post
        delete_response = client.delete(
            f'/api/v1/post/{post.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            }
        )
        assert delete_response.status_code == HTTPStatus.BAD_REQUEST
        assert delete_response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES

        put_response = client.put(
            f'/api/v1/post/{post.id}',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(secondary_context['user_id']).decode()
            },
            json={
                'visibility': 'private', 'metadata_json': {'data': 'test_data'}
            }
        )
        assert put_response.status_code == HTTPStatus.BAD_REQUEST
        assert put_response.json['message'] == Errors.INSUFFICIENT_PRIVILEGES
