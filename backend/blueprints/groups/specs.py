from voluptuous import All, Length, Required, Schema, Coerce
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
    Required('social_group_id'): int,
    Required('user_id'): int,
    Required('role'): All(str, Coerce(SocialGroupRole))
})


MEMBER_OUTPUT_SPEC = {
    'role': ('role', lambda role: role.name),
    'user_id': 'user_id',
    'social_group_id': 'social_group_id',
}
