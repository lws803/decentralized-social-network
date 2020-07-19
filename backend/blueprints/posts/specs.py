from voluptuous import ALLOW_EXTRA, All, Any, Coerce, Required, Schema

from common.constants import VisibilityType
from common.validation import format_datetime


POST_METADATA_SCHEMA = Schema({
    Required('data'): Any(str, bytes)  # TODO: Add a max length
}, extra=ALLOW_EXTRA)


NEW_POST_SCHEMA = Schema({
    Required('social_group_id'): int,
    'tags': list,
    Required('metadata_json'): POST_METADATA_SCHEMA,
    Required('visibility'): All(str, Coerce(VisibilityType)),
})


POST_OUTPUT_SPEC = {
    'user_id': 'owner_id',
    'id': 'id',
    'metadata_json': 'metadata_json',
    'tags': 'tags',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
    'social_group_id': 'social_group_id',
    'depth': 'depth',
}
