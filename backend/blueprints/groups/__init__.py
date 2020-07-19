from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.groups.specs import NEW_GROUP_SCHEMA, GROUP_OUTPUT_SPEC
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import SocialGroupMember, SocialGroup
from common.parameters import get_request_json
from common.validation import validate
from common.constants import SocialGroupRole


social_groups_blueprint = Blueprint('social_groups_blueprint', __name__)


@authentication.require_login
def is_admin_of_group(db_session, social_group_id, user_id=None):
    existing_membership = (
        db_session.query(SocialGroupMember)
        .filter_by(social_group_id=social_group_id)
        .filter_by(user_id=user_id)
        .filter_by(role=SocialGroupRole.ADMIN.name)
    ).one_or_none()
    if not existing_membership:
        raise InvalidUsage(Errors.INSUFFICIENT_PRIVILEGES)
    return True


@social_groups_blueprint.route('/api/v1/social_group/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_group(user_id):
    body = validate(get_request_json(), 'new_group_schema', NEW_GROUP_SCHEMA)

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        existing_group = db_session.query(SocialGroup).filter_by(name=body['name']).one_or_none()
        if existing_group:
            raise InvalidUsage(Errors.GROUP_EXISTS)

        new_group = SocialGroup(**body)
        db_session.add(new_group)
        db_session.commit()

        db_session.add(SocialGroupMember(
            user_id=user_id,
            social_group_id=new_group.id,
            role=SocialGroupRole.ADMIN
        ))
        db_session.commit()

        return glom(new_group, GROUP_OUTPUT_SPEC)


@social_groups_blueprint.route('/api/v1/social_group/<social_group_id>', methods=['GET', 'DELETE'])
@authentication.require_appkey
def group_access(social_group_id):
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        if request.method == 'DELETE':
            existing_group = (
                db_session.query(SocialGroup)
                .filter_by(id=social_group_id)
            ).one_or_none()
            if not existing_group:
                return '', HTTPStatus.NOT_FOUND
            is_admin_of_group(db_session, existing_group.id)
            db_session.query(SocialGroup).filter_by(id=social_group_id).delete()
            db_session.commit()
            return '', HTTPStatus.ACCEPTED
        else:
            existing_group = (
                db_session.query(SocialGroup)
                .filter_by(id=social_group_id)
            ).one_or_none()
            if existing_group:
                return glom(existing_group, GROUP_OUTPUT_SPEC), HTTPStatus.OK
            else:
                return '', HTTPStatus.NOT_FOUND


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
