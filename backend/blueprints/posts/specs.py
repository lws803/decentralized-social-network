from glom import S as Scope, glom
from voluptuous import ALLOW_EXTRA, All, Any, Coerce, Required, Schema

from common.constants import VisibilityType
from common.validation import format_datetime


POST_METADATA_SCHEMA = Schema({
    Required('data'): Any(str, bytes)  # TODO: Add a max length
}, extra=ALLOW_EXTRA)


NEW_TAGS_SCHEMA = Schema([str])


NEW_POST_SCHEMA = Schema({
    Required('social_group_id'): int,
    'tags': NEW_TAGS_SCHEMA,  # TODO: Add max number of tags possible too
    Required('metadata_json'): POST_METADATA_SCHEMA,
    Required('visibility'): All(str, Coerce(VisibilityType)),
})


TAG_OUTPUT_SPEC = {
    'id': 'id',
    'name': 'name',
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
}

POST_OUTPUT_SPEC = {
    'user_id': 'owner_id',
    'id': 'id',
    'metadata_json': 'metadata_json',
    'tags': ('tags', lambda tags: glom(tags, [TAG_OUTPUT_SPEC])),
    'created_at': ('created_at', format_datetime),
    'updated_at': ('updated_at', format_datetime),
    'social_group_id': 'social_group_id',
    'depth': 'depth',
}


POSTS_OUTPUT_SPEC = {
    'posts': [POST_OUTPUT_SPEC],
    'total_count': Scope['total_count']
}
