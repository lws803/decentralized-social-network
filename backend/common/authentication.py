import os
from functools import wraps

from flask import request

from common.exceptions import Forbidden
from common.messages import Errors


def require_appkey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        if request.headers.get('Key') and request.headers.get('Key') == os.environ.get('API_KEY'):
            return view_function(*args, **kwargs)
        else:
            raise Forbidden(Errors.INCORRECT_API_KEY)
    return decorated_function
