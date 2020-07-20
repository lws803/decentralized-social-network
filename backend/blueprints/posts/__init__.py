from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.posts.specs import (
    NEW_POST_SCHEMA,
    PARTIAL_POST_SCHEMA,
    POST_ARGS_SCHEMA,
    POST_OUTPUT_SPEC,
    POSTS_OUTPUT_SPEC,
)
from common import authentication
from common.constants import SocialGroupRole
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import Post, SocialGroupMember, Tag
from common.parameters import get_request_json
from common.specs import get_pagination_schema
from common.utils import DictArgParser, get_offset
from common.validation import validate


posts_blueprint = Blueprint('posts_blueprint', __name__)


@authentication.require_login
def check_admin_or_owner(db_session, post, user_id=None):
    if user_id == post.owner_id:
        return True
    group_member = (
        db_session.query(SocialGroupMember)
        .filter_by(user_id=user_id)
        .filter_by(social_group_id=post.social_group_id)
    ).one_or_none()
    if group_member and group_member.role == SocialGroupRole.MEMBER.name:
        return True
    raise InvalidUsage(Errors.INSUFFICIENT_PRIVILEGES)


@posts_blueprint.route('/api/v1/post/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_post(user_id):
    body = validate(get_request_json(), 'new_post_schema', NEW_POST_SCHEMA)

    social_group_id = body.get('social_group_id')
    tags = body.pop('tags') if 'tags' in body else []

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        group_member = (
            db_session.query(SocialGroupMember)
            .filter_by(user_id=user_id)
            .filter_by(social_group_id=social_group_id)
        ).one_or_none()
        if not group_member:
            raise InvalidUsage(Errors.INSUFFICIENT_PRIVILEGES)
        new_post = Post(
            owner_id=user_id,
            **body
        )
        db_session.add(new_post)
        db_session.commit()

        for tag in set(tags):
            db_session.add(Tag(
                post_id=new_post.id,
                name=tag
            ))
        db_session.commit()
        return glom(new_post, POST_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@posts_blueprint.route('/api/v1/post/<post_id>', methods=['GET', 'DELETE', 'PUT'])
@authentication.require_appkey
def post_access(post_id):
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        if request.method == 'DELETE':
            post = db_session.query(Post).filter_by(id=post_id).one_or_none()
            if not post:
                return '', HTTPStatus.NOT_FOUND

            check_admin_or_owner(db_session, post)

            db_session.query(Post).filter_by(id=post_id).delete()
            db_session.commit()
            return '', HTTPStatus.ACCEPTED
        elif request.method == 'GET':
            post = db_session.query(Post).filter_by(id=post_id).one_or_none()
            if post:
                return glom(post, POST_OUTPUT_SPEC)
            else:
                return '', HTTPStatus.NOT_FOUND
        elif request.method == 'PUT':
            body = validate(get_request_json(), 'partial_post_schema', PARTIAL_POST_SCHEMA)
            tags = body.pop('tags') if 'tags' in body else []

            post = db_session.query(Post).filter_by(id=post_id).one_or_none()
            if not post:
                return '', HTTPStatus.NOT_FOUND
            check_admin_or_owner(db_session, post)

            for key, value in body.items():
                setattr(post, key, value)

            if tags:
                db_session.query(Tag).filter_by(post_id=post.id).delete()
                for tag in set(tags):
                    db_session.add(Tag(
                        post_id=post.id,
                        name=tag
                    ))
            db_session.commit()
            return glom(post, POST_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@posts_blueprint.route('/api/v1/posts', methods=['GET'])
@authentication.require_appkey
def list_posts():
    request_args = validate(
        DictArgParser.parse(request.args), 'post_args_schema', POST_ARGS_SCHEMA
    )

    page = request_args['page']
    num_results_per_page = request_args['num_results_per_page']
    offset = get_offset(page, num_results_per_page)[0]

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        query = db_session.query(Post).filter_by(social_group_id=request_args['social_group_id'])

        posts = query.order_by(Post.id).offset(offset).limit(num_results_per_page).all()
        count = query.count()
        return glom(posts, POSTS_OUTPUT_SPEC, scope={'total_count': count})
