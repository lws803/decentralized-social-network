from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import Post, SocialGroupMember, Tag
from common.parameters import get_request_json
from common.validation import validate
from common.constants import SocialGroupRole


social_groups_blueprint = Blueprint('social_groups_blueprint', __name__)


@social_groups_blueprint.route('/api/v1/social_group/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_group(user_id):
    pass


@social_groups_blueprint.route('/api/v1/social_group/<group_id>', methods=['GET', 'DELETE'])
@authentication.require_appkey
def group_access(group_id):
    pass
