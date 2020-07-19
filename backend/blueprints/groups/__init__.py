from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.groups.specs import NEW_GROUP_SCHEMA
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import SocialGroupMember, SocialGroup
from common.parameters import get_request_json
from common.validation import validate
from common.constants import SocialGroupRole


social_groups_blueprint = Blueprint('social_groups_blueprint', __name__)


def is_admin_of_group(user_id):
    pass


@social_groups_blueprint.route('/api/v1/social_group/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_group(user_id):
    body = validate(get_request_json(), 'new_group_schema', NEW_GROUP_SCHEMA)

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        pass


@social_groups_blueprint.route('/api/v1/social_group/<group_id>', methods=['GET', 'DELETE'])
@authentication.require_appkey
def group_access(group_id):
    pass


@social_groups_blueprint.route('/api/v1/social_group/members', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def add_member(user_id):
    pass


@social_groups_blueprint.route(
    '/api/v1/social_group/members/<member_id>', methods=['GET', 'DELETE']
)
@authentication.require_appkey
@authentication.require_login
def member_access(user_id, member_id):
    pass
