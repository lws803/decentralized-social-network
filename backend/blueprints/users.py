from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.specs import USER_OUTPUT_SPEC, NEW_USER_SPEC
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import User
from common.parameters import get_request_json
from common.validation import validate


users_blueprint = Blueprint('users_blueprint', __name__)


@users_blueprint.route('/api/v1/user', methods=['POST', 'GET', 'DELETE'])
@authentication.require_appkey
def user_access():
    user_id = request.headers.get('User')
    if not user_id:
        raise InvalidUsage(Errors.NO_USER_ID)
    mysql_connector = current_app.config['mysql_connector']

    if request.method == 'POST':
        body = validate(get_request_json(optional=True), 'new_user_schema', NEW_USER_SPEC)
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(uid=user_id).one_or_none()
            if not user:
                user = User(
                    uid=user_id,
                    metadata_json=body.get('metadata')
                )
                db_session.add(user)
                db_session.commit()
            else:
                raise InvalidUsage(Errors.USER_EXISTS)

            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.ACCEPTED

    elif request.method == 'GET':
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(uid=user_id).one_or_none()
            if not user:
                raise InvalidUsage(Errors.NO_USER_ID)

            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.OK

    elif request.method == 'DELETE':
        with mysql_connector.session() as db_session:
            user = db_session.query(User).filter_by(uid=user_id).one_or_none()
            if not user:
                raise InvalidUsage(Errors.NO_USER_ID)
            else:
                db_session.delete(user)
                db_session.commit()

            return glom(user, USER_OUTPUT_SPEC), HTTPStatus.OK
