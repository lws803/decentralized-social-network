from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.groups.specs import (
    GROUP_OUTPUT_SPEC,
    MEMBER_OUTPUT_SPEC,
    MEMBERS_OUTPUT_SPEC,
    NEW_GROUP_SCHEMA,
    NEW_MEMBER_SCHEMA,
    PARTIAL_GROUP_SCHEMA,
    PARTIAL_MEMBER_SCHEMA,
)
from common import authentication
from common.constants import SocialGroupRole
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import SocialGroup, SocialGroupMember
from common.parameters import get_request_json
from common.validation import validate


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


def is_admin_of_group_or_ownself(db_session, social_group_id, member_user_id, user_id):
    existing_admin = (
        db_session.query(SocialGroupMember)
        .filter_by(social_group_id=social_group_id)
        .filter_by(user_id=user_id)
        .filter_by(role=SocialGroupRole.ADMIN.name)
    ).one_or_none()
    if all((not existing_admin, str(member_user_id) != str(user_id))):
        raise InvalidUsage(Errors.INSUFFICIENT_PRIVILEGES)


def ensure_name_does_not_exist(db_session, name, group_id):
    existing = db_session.query(SocialGroup).filter_by(name=name).one_or_none()
    if existing and existing.id != group_id:
        raise InvalidUsage(Errors.GROUP_EXISTS)


def ensure_member_role_does_not_exist(db_session, user_id, social_group_id):
    existing_role = (
        db_session.query(SocialGroupMember)
        .filter_by(user_id=user_id)
        .filter_by(social_group_id=social_group_id)
    ).all()
    if existing_role:
        raise InvalidUsage(Errors.MEMBER_EXISTS)

@social_groups_blueprint.route('/api/v1/social_group/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def new_group(user_id):
    body = validate(get_request_json(), 'new_group_schema', NEW_GROUP_SCHEMA)

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        ensure_name_does_not_exist(db_session, body['name'], None)

        new_group = SocialGroup(**body)
        db_session.add(new_group)
        db_session.commit()

        db_session.add(SocialGroupMember(
            user_id=user_id,
            social_group_id=new_group.id,
            role=SocialGroupRole.ADMIN
        ))
        db_session.commit()

        return glom(new_group, GROUP_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@social_groups_blueprint.route(
    '/api/v1/social_group/<social_group_id>', methods=['GET', 'DELETE', 'PUT']
)
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

        elif request.method == 'GET':
            existing_group = (
                db_session.query(SocialGroup)
                .filter_by(id=social_group_id)
            ).one_or_none()
            if existing_group:
                return glom(existing_group, GROUP_OUTPUT_SPEC), HTTPStatus.OK
            else:
                return '', HTTPStatus.NOT_FOUND

        elif request.method == 'PUT':
            body = validate(get_request_json(), 'partial_group_schema', PARTIAL_GROUP_SCHEMA)

            existing_group = (
                db_session.query(SocialGroup)
                .filter_by(id=social_group_id)
            ).one_or_none()
            if not existing_group:
                return '', HTTPStatus.NOT_FOUND
            is_admin_of_group(db_session, existing_group.id)

            if 'name' in body:
                ensure_name_does_not_exist(db_session, body['name'], existing_group.id)

            for key, value in body.items():
                setattr(existing_group, key, value)
            db_session.commit()
            return glom(existing_group, GROUP_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@social_groups_blueprint.route('/api/v1/social_group/members/new', methods=['POST'])
@authentication.require_appkey
@authentication.require_login
def add_member(user_id):
    body = validate(get_request_json(), 'new_member_schema', NEW_MEMBER_SCHEMA)
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        social_group_id = body['social_group_id']

        is_admin_of_group(db_session, social_group_id)
        ensure_member_role_does_not_exist(db_session, body['user_id'], social_group_id)

        new_member = SocialGroupMember(
            user_id=body['user_id'],
            social_group_id=social_group_id,
            role=body['role']
        )
        db_session.add(new_member)
        db_session.commit()

        return glom(new_member, MEMBER_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@social_groups_blueprint.route(
    '/api/v1/social_group/members/<member_user_id>', methods=['GET', 'DELETE', 'PUT']
)
@authentication.require_appkey
@authentication.require_login
def member_access(user_id, member_user_id):
    mysql_connector = current_app.config['mysql_connector']
    body = validate(get_request_json(), 'partial_member_schema', PARTIAL_MEMBER_SCHEMA)
    social_group_id = body['social_group_id']

    with mysql_connector.session() as db_session:
        if request.method == 'GET':
            existing_membership = (
                db_session.query(SocialGroupMember)
                .filter_by(user_id=member_user_id)
                .filter_by(social_group_id=social_group_id)
            ).one_or_none()
            if not existing_membership:
                return '', HTTPStatus.NOT_FOUND
            return glom(existing_membership, MEMBER_OUTPUT_SPEC)

        elif request.method == 'DELETE':
            existing_membership = (
                db_session.query(SocialGroupMember)
                .filter_by(social_group_id=social_group_id)
                .filter_by(user_id=member_user_id)
            ).one_or_none()

            if not existing_membership:
                return '', HTTPStatus.NOT_FOUND

            is_admin_of_group_or_ownself(db_session, social_group_id, member_user_id, user_id)

            db_session.query(SocialGroupMember).filter_by(id=existing_membership.id).delete()
            db_session.commit()
            return '', HTTPStatus.ACCEPTED

        elif request.method == 'PUT':
            existing_membership = (
                db_session.query(SocialGroupMember)
                .filter_by(social_group_id=social_group_id)
                .filter_by(user_id=member_user_id)
            ).one_or_none()

            is_admin_of_group(db_session, social_group_id)

            if not existing_membership:
                return '', HTTPStatus.NOT_FOUND
            if body.get('role'):
                setattr(existing_membership, 'role', body.get('role'))
            db_session.commit()

            return glom(existing_membership, MEMBER_OUTPUT_SPEC), HTTPStatus.ACCEPTED


@social_groups_blueprint.route('/api/v1/social_group/members', methods=['GET'])
@authentication.require_appkey
@authentication.require_login
def list_members(user_id):
    body = validate(get_request_json(), 'new_member_schema', PARTIAL_MEMBER_SCHEMA)
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        social_group_id = body['social_group_id']

        all_members = (
            db_session.query(SocialGroupMember)
            .filter_by(social_group_id=social_group_id)
        ).all()

        return glom(
            all_members, MEMBERS_OUTPUT_SPEC, scope={'total_count': len(all_members)}
        ), HTTPStatus.OK
