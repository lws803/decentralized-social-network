from voluptuous import Schema, Required, All, Length


NEW_GROUP_SCHEMA = Schema({
    Required('name'): All(str, Length(255))
})
