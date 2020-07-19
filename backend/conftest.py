import pytest

from common.testing.utils import _db_session


@pytest.fixture(scope='session')
def db_session():
    """
    sqlalchemy.orm.scoped_session fixture, so tests can access SQL DB easily
    """

    yield _db_session
