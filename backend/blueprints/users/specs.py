
from voluptuous import Schema

from common.validation import format_datetime
from glom import S as Scope


NEW_USER_SPEC = Schema({
    'metadata': dict
})

USER_OUTPUT_SPEC = {
    'id': 'uid',
    'metadata': 'metadata_json',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
}

LOGIN_OUTPUT_SPEC = {
    'id': 'uid',
    'token': Scope['token']
}
