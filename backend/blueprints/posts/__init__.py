from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.posts.specs import NEW_POST_SCHEMA, POST_OUTPUT_SPEC, POSTS_OUTPUT_SPEC
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import Post, SocialGroupMember, Tag
from common.parameters import get_request_json
from common.validation import validate
from common.constants import SocialGroupRole


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
            raise InvalidUsage(Errors.USER_NOT_IN_GROUP)
        new_post = Post(
            owner_id=user_id,
            **body
        )
        db_session.add(new_post)
        db_session.commit()

        for tag in tags:
            db_session.add(Tag(
                post_id=new_post.id,
                name=tag
            ))
        db_session.commit()
        return glom(new_post, POST_OUTPUT_SPEC)


@posts_blueprint.route('/api/v1/post/<post_id>', methods=['GET', 'DELETE'])
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
        else:
            post = db_session.query(Post).filter_by(id=post_id).one_or_none()
            if post:
                return glom(post, POST_OUTPUT_SPEC)
            else:
                return '', HTTPStatus.NOT_FOUND


@posts_blueprint.route('/api/v1/posts', methods=['GET'])
@authentication.require_appkey
def list_posts():
    # TODO: Should be paginated
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        posts = db_session.query(Post).all()
        return glom(posts, POSTS_OUTPUT_SPEC, scope={'total_count': len(posts)})
