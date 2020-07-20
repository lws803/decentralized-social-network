class Errors:
    NO_USER_ID = 'User could not be verified, please login again.'

    MYSQL_SERVER_NOT_SET = 'Mysql server has not been set.'

    USER_EXISTS = 'New user could not be created, user already exists'

    TOKEN_EXPIRED = 'Token expired, please login again.'

    TOKEN_INVALID = 'Invalid token, please login again.'

    INCORRECT_API_KEY = (
        'API Key supplied is incorrect. Please contact system administrator for help.'
    )

    INSUFFICIENT_PRIVILEGES = 'User has insufficient privileges to perform this action.'

    GROUP_EXISTS = 'Group name already taken, please choose a different name.'

    USER_NAME_EXISTS = 'Username already taken, please choose a different name.'

    MEMBER_EXISTS = 'Please use PUT if you wish to change member\'s role.'

    PARAM_DICTIONARY_CHECK = (
        "Both dictionary and non dictionary value is supplied for %s key."
    )
