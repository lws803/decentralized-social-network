from http import HTTPStatus

import pytest
from pytest_voluptuous import S as Schema, Unordered

from common.authentication import encode_auth_token
from common.constants import SocialGroupRole, VisibilityType
from common.messages import Errors
from common.models import SocialGroup, SocialGroupMember, User
from common.testing.factories import (
    SocialGroupFactory,
    UserFactory,
)


@pytest.fixture
def populate_db(db_session, context, secondary_context):
    
    db_session.commit()
    yield
    for model in (User, SocialGroup, SocialGroupMember):
        db_session.query(model).delete()
    db_session.commit()
