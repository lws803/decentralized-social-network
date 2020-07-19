from http import HTTPStatus

from flask import Blueprint, current_app, request

from common import authentication
from common.exceptions import InvalidUsage
from common.messages import Errors
from common.models import User


users_blueprint = Blueprint('users_blueprint', __name__)


@users_blueprint.route('/api/v1/user', methods=['POST'])
@authentication.require_appkey
def new_social_id():
    user_id = request.headers.get('User')
    if not user_id:
        raise InvalidUsage(Errors.NO_SOCIAL_ID)

    mysql_connector = current_app.config['mysql_connector']
    with mysql_connector.session() as db_session:
        existing_user = db_session.query(User).filter_by(uid=user_id).one_or_none()
        if not existing_user:
            existing_user = User(uid=user_id)
            db_session.add(existing_user)
            db_session.commit()

        return '', HTTPStatus.ACCEPTED
