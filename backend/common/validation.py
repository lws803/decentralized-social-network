from voluptuous import Invalid

from common.exceptions import InvalidUsage


def validate(data, schema_name, schema):
    try:
        return schema(data)
    except Invalid as exception:
        raise InvalidUsage(str(exception))


def format_datetime(dt):
    """Format datetime in isoformat to be returned to user.

    :param dt: Datetime object that needs to be formatted
    :type dt: datetime.datetime
    :result: Datetime formatted in isoformat
    :rtype: str

    """
    if dt is None:
        return None
    return dt.isoformat()
