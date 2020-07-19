from voluptuous import Schema, Required, All, Length

from common.validation import format_datetime
from glom import S as Scope


NEW_USER_SPEC = Schema({
    'metadata_json': dict,
    Required('name'): All(str, Length(max=100))
})

USER_OUTPUT_SPEC = {
    'id': 'id',
    'name': 'name',
    'metadata_json': 'metadata_json',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
}

LOGIN_OUTPUT_SPEC = {
    'id': 'id',
    'name': 'name',
    'token': Scope['token']
}
