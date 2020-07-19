from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.posts.specs import NEW_POST_SCHEMA, POST_OUTPUT_SPEC
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import Post, SocialGroupMember, Tag
from common.parameters import get_request_json
from common.validation import validate


posts_blueprint = Blueprint('posts_blueprint', __name__)


@posts_blueprint.route('/api/v1/post/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_post(user_id):
    body = validate(get_request_json(), 'new_post_schema', NEW_POST_SCHEMA)

    group_id = body.get('group_id')
    tags = body.pop('tags') if 'tags' in body else []

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        group_member = (
            db_session.query(SocialGroupMember)
            .filter_by(user_id=user_id)
            .filter_by(social_group_id=group_id)
        ).one_or_none()
        if not group_member:
            raise InvalidUsage(Errors.USER_NOT_IN_GROUP)
        new_post = Post(
            owner_id=user_id,
            **body
        )
        db_session.add(new_post)
        for tag in tags:
            db_session.add(Tag(
                post_id=new_post.id
            ))
        db_session.commit()
        return glom(new_post, POST_OUTPUT_SPEC)


@posts_blueprint.route('/api/v1/post/<post_id>', methods=['GET', 'DELETE'])
@authentication.require_appkey
@authentication.require_login
def post_access(post_id):
    return


@posts_blueprint.route('/api/v1/posts', methods=['GET'])
@authentication.require_appkey
@authentication.require_login
def list_posts():
    return
