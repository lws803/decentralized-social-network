from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import User
from common.parameters import get_request_json
from common.validation import validate


posts_blueprint = Blueprint('posts_blueprint', __name__)


@posts_blueprint.route('/api/v1/post/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_post():
    return


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
