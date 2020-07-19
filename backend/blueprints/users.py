from http import HTTPStatus

from flask import Blueprint, current_app, request
from glom import glom

from blueprints.specs import NEW_USER_OUTPUT_SPEC, NEW_USER_SPEC
from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import User
from common.parameters import get_request_json
from common.validation import validate


users_blueprint = Blueprint('users_blueprint', __name__)


@users_blueprint.route('/api/v1/user', methods=['POST'])
@authentication.require_appkey
def new_user():
    user_id = request.headers.get('User')
    if not user_id:
        raise InvalidUsage(Errors.NO_SOCIAL_ID)
    body = validate(get_request_json(optional=True), 'new_user_schema', NEW_USER_SPEC)

    mysql_connector = current_app.config['mysql_connector']
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

        return glom(user, NEW_USER_OUTPUT_SPEC), HTTPStatus.ACCEPTED
