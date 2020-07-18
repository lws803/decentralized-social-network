from flask import request


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, msg="Unknown Error", status_code=None, payload=None,
                 error_items=None):
        Exception.__init__(self)
        if status_code is not None:
            self.status_code = status_code
            if status_code == 404 and not msg:
                msg = 'Not Found: ' + request.url
            if status_code == 400 and not msg:
                msg = 'Invalid Format or Unknown Error'
            if status_code == 500 and not msg:
                msg = 'Unknown internal server error'
        self.msg = msg
        self.payload = payload
        self.error_items = error_items

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.msg
        if self.error_items:
            rv['error_items'] = self.error_items
        return rv


class Forbidden(Exception):
    status_code = 401

    def __init__(self, msg="Forbidden", status_code=None):
        Exception.__init__(self)
        if status_code is not None:
            self.status_code = status_code
        self.msg = msg

    def to_dict(self):
        rv = {'message': self.msg}
        return rv
