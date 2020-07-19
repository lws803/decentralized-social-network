import werkzeug
from flask import request

from common.exceptions import InvalidUsage


def get_request_json(optional=False):
    """A safe version of request.get_json(). In the case where request_json
    is None, an exception is immediately thrown rather than letting the caller
    handle the None object

    Returns:
        a Python dictionary
    """
    try:
        # force=true ignores the Content-Type header & always tries to parse the request body.
        # This is needed for POST /v2/behavioral_action endpoints, where we allow the use of
        # Content-Type: text/plain to avoid pre-flight requests
        # Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
        request_json = request.get_json(force=True)
    except werkzeug.exceptions.BadRequest:
        request_json = None

    if request_json is None and not optional:
        if request.data:
            raise InvalidUsage('Invalid JSON: {}'.format(request.get_data(as_text=True)))

        raise InvalidUsage(
            'No JSON supplied in {} body. JSON required for this method. '
            'Check docs for proper usage.'
            .format(request.method)
        )
    return request_json or {}
