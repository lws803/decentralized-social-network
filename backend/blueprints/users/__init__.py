from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.users.specs import (
    LOGIN_OUTPUT_SPEC,
    NEW_USER_SPEC,
    PARTIAL_USER_SCHEMA,
    USER_OUTPUT_SPEC,
)
from common import authentication
from common.authentication import encode_auth_token
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import User
from common.parameters import get_request_json
from common.validation import validate


users_blueprint = Blueprint('users_blueprint', __name__)


def ensure_name_not_duplicate(db_session, name):
    existing_user = db_session.query(User).filter_by(name=name).one_or_none()
    if existing_user:
        raise InvalidUsage(Errors.USER_NAME_EXISTS)


@users_blueprint.route('/api/v1/user/new', methods=['POST'])
@authentication.require_appkey
def new_user():
    uid = request.headers.get('User')
    if not uid:
        raise InvalidUsage(Errors.NO_USER_ID)
    mysql_connector = current_app.config['mysql_connector']
    body = validate(get_request_json(optional=True), 'new_user_schema', NEW_USER_SPEC)
    with mysql_connector.session() as db_session:
        user = db_session.query(User).filter_by(uid=uid).one_or_none()
        if not user:
            ensure_name_not_duplicate(db_session, body['name'])
            user = User(
                uid=uid,
                **body
            )
            db_session.add(user)
            db_session.commit()
        else:
            raise InvalidUsage(Errors.USER_EXISTS)
        auth_token = encode_auth_token(user.id)
        return glom(
            user, LOGIN_OUTPUT_SPEC, scope={'token': auth_token.decode()}
        ), HTTPStatus.ACCEPTED


@users_blueprint.route('/api/v1/user', methods=['GET', 'DELETE', 'PUT'])
@authentication.require_appkey
@authentication.require_login
def user_access(user_id):
    mysql_connector = current_app.config['mysql_connector']

    if request.method == 'GET':
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(id=user_id).one_or_none()
            if not user:
                raise InvalidUsage(Errors.NO_USER_ID)

            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.OK

    elif request.method == 'DELETE':
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(id=user_id).one_or_none()
            if not user:
                raise InvalidUsage(Errors.NO_USER_ID)
            db_session.delete(user)
            db_session.commit()

            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.OK

    elif request.method == 'PUT':
        body = validate(get_request_json(), 'partial_user_schema', PARTIAL_USER_SCHEMA)
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(id=user_id).one_or_none()
            if not user:
                raise InvalidUsage(Errors.NO_USER_ID)
            if 'name' in body:
                ensure_name_not_duplicate(db_session, body['name'])
            for key, value in body.items():
                setattr(user, key, value)
            db_session.commit()
            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.OK


@users_blueprint.route('/api/v1/user/login', methods=['POST'])
@authentication.require_appkey
def user_login():
    uid = request.headers.get('User')
    if not uid:
        raise InvalidUsage(Errors.NO_USER_ID)
    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        user = db_session.query(User).filter_by(uid=uid).one_or_none()
        if not user:
            raise InvalidUsage(Errors.NO_USER_ID)
        auth_token = encode_auth_token(user.id)
        return glom(
            user, LOGIN_OUTPUT_SPEC, scope={'token': auth_token.decode()}
        ), HTTPStatus.OK
