
from voluptuous import Schema

from common.validation import format_datetime


NEW_USER_SPEC = Schema({
    'metadata': dict
})

NEW_USER_OUTPUT_SPEC = {
    'id': 'uid',
    'metadata': 'metadata_json',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
}
