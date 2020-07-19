
from voluptuous import Schema

from common.validation import format_datetime
from glom import S as Scope


NEW_USER_SPEC = Schema({
    'metadata_json': dict
})

USER_OUTPUT_SPEC = {
    'id': 'id',
    'metadata_json': 'metadata_json',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
}

LOGIN_OUTPUT_SPEC = {
    'id': 'id',
    'token': Scope['token']
}
