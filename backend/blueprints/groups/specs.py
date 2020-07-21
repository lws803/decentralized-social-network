from glom import S as Scope
from voluptuous import All, Coerce, Length, Required, Schema

from common.constants import SocialGroupRole


NEW_GROUP_SCHEMA = Schema({
    Required('name'): All(str, Length(max=100)),
    'metadata_json': dict,
})


PARTIAL_GROUP_SCHEMA = Schema({
    'name': All(str, Length(max=100)),
    'metadata_json': dict,
})


GROUP_OUTPUT_SPEC = {
    'id': 'id',
    'name': 'name',
    'metadata_json': 'metadata_json',
}


NEW_MEMBER_SCHEMA = Schema({
    Required('social_group_id'): str,
    Required('user_id'): str,
    Required('role'): All(str, Coerce(SocialGroupRole))
})


PARTIAL_MEMBER_SCHEMA = Schema({
    'role': All(str, Coerce(SocialGroupRole)),
})


MEMBER_OUTPUT_SPEC = {
    'role': ('role', lambda role: role.name),
    'user_id': 'user_id',
    'social_group_id': 'social_group_id',
}


MEMBERS_OUTPUT_SPEC = {
    'members': [MEMBER_OUTPUT_SPEC],
    'total_count': Scope['total_count']
}


GROUP_ARGS_SCHEMA = Schema(
    {
        Required('social_group_id'): str,
    }
)
