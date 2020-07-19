from voluptuous import All, Length, Required, Schema


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
