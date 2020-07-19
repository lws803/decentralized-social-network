from voluptuous import ALLOW_EXTRA, All, Any, Length, Required, Schema


GROUP_METADATA_SCHEMA = Schema({
    Required('data'): All(
        Any(str, bytes), Length(max=2000)
    )
}, extra=ALLOW_EXTRA)


NEW_GROUP_SCHEMA = Schema({
    Required('name'): All(str, Length(max=100)),
    'metadata_json': GROUP_METADATA_SCHEMA,
})


GROUP_OUTPUT_SPEC = {
    'id': 'id',
    'metadata_json': 'metadata_json',
}
