import os
from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import current_app, request

from common.exceptions import Forbidden
from common.messages import Errors


def require_appkey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        if all((
            request.headers.get('Key'),
            request.headers.get('Key') == current_app.config.get('api_key'))
        ):
            return view_function(*args, **kwargs)
        else:
            raise Forbidden(Errors.INCORRECT_API_KEY)
    return decorated_function


def require_login(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        auth_token = request.headers.get('Authorization', '')
        kwargs['user_id'] = decode_auth_token(auth_token)
        return view_function(*args, **kwargs)
    return decorated_function


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            os.environ.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """
    Validates the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, os.environ.get('SECRET_KEY'))
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise Forbidden(Errors.TOKEN_EXPIRED)
    except jwt.InvalidTokenError:
        raise Forbidden(Errors.TOKEN_INVALID)
