from glom import S as Scope, glom
from voluptuous import ALLOW_EXTRA, All, Any, Coerce, Length, Required, Schema

from common.constants import VisibilityType
from common.specs import get_pagination_schema
from common.validation import format_datetime


POST_METADATA_SCHEMA = Schema({
    Required('data'): All(
        Any(str, bytes), Length(max=2000)
    )
}, extra=ALLOW_EXTRA)


NEW_TAGS_SCHEMA = Schema(
    All([
        All(str, Length(max=10))
    ], Length(max=10))
)


NEW_POST_SCHEMA = Schema({
    Required('social_group_id'): str,
    'tags': NEW_TAGS_SCHEMA,
    Required('metadata_json'): POST_METADATA_SCHEMA,
    Required('visibility'): All(str, Coerce(VisibilityType)),
})


PARTIAL_POST_SCHEMA = Schema({
    'tags': NEW_TAGS_SCHEMA,
    'metadata_json': POST_METADATA_SCHEMA,
    'visibility': All(str, Coerce(VisibilityType)),
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
    'visibility': ('visibility', lambda visibility: visibility.name)
}


POSTS_OUTPUT_SPEC = {
    'posts': [POST_OUTPUT_SPEC],
    'total_count': Scope['total_count']
}


POST_ARGS_SCHEMA = Schema({
    Required('social_group_id'): str,
}).extend(
    get_pagination_schema().schema
)
